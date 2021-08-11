const { DatabaseUtil } = require("../utils/database.util")
const {Transaction} = require("../../models/transaction.model")
const ExcelJS = require('exceljs');
const {Op} = require("sequelize");
const uuid = require("uuid").v4
const { SecondaryAccountHolder } = require("../../models/secondaryHolder.model");
const { Account } = require("../../models/account.model");
const { TransactionService } = require("./Transaction.service");
const Stream = require('stream');
const AWS = require("aws-sdk")

 
module.exports.ExpenseTrackingService = class ExpenseTrackingService {
    static async getMonthlyOverview(event) {
        try {
            const requestParams = event["queryStringParameters"];
            console.log('Expense Tracking ', requestParams) 
            let { accountNumber , secondaryId  } = requestParams
            console.log("account number ",accountNumber)
            const startOfMonth = new Date(new Date().setDate(new Date().getDate() - new Date().getDate() + 1));
            startOfMonth.setUTCHours(23, 59 , 59 , 999);
            // const { accountHolder, ...account} = {...accountDetails };
            let where;
            if(secondaryId){

                where ={
                    senderAccountNumber: accountNumber,
                    secondaryId:secondaryId,
                    transactionStartedAt: { [Op.gt]: startOfMonth, }

                }

            }
            else{
                where = {
                    senderAccountNumber: accountNumber,
                    transactionStartedAt: { [Op.gt]: startOfMonth, }
                }

            }

            await DatabaseUtil.getDbConnection()
            const monthlyTransactions = await Transaction.findAll({
                where: where
            })

            return monthlyTransactions
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async getRecentTransaction(event) {
        try {
            
             const requestParams = event["queryStringParameters"];
             console.log('Recent Transaction  ', requestParams)
             let { id  } = requestParams
            const accountNumber = id;
            // const { accountHolder, ...account} = {...accountDetails };
            await DatabaseUtil.getDbConnection()
            const recentTransactions = await Transaction.findAll({
                where:{
                    
                    senderAccountNumber: accountNumber,
                },
                limit: 5,
                order: [
                     ['transactionStartedAt', 'DESC']],
            })

            return recentTransactions
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async getBalance(event) {
        try {
            
             const requestParams = event["queryStringParameters"];
             console.log('Get Balance  ', requestParams)
             let { accountNumber , secondaryId ,customerId  } = requestParams
             await DatabaseUtil.getDbConnection()
             if(secondaryId){
                 const balance = await SecondaryAccountHolder.findAll({
                     where:{
                        secondaryId:secondaryId
                     }
                 })
                 return balance
             }
             else{
                 const result = {};
                const balance = await SecondaryAccountHolder.findAll({
                    where:{
                        accountNumber:accountNumber
                    }
                })
                const accountbalance = await Account.findAll({
                    where:{
                        accountNumber:accountNumber
                    }
                })
                console.log("Account ",accountbalance);
                result["primaryaccount"] = accountbalance
                result["secondaryaccounts"] = balance;
                return result;

             }
             // const { accountHolder, ...account} = {...accountDetails };
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
     static async exportReport(event)  {
        
        // Exporting tickets
          try {
              console.log("In Export ",event)
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Admin Report");
    
            worksheet.columns = [
              { header: 'Transaction Id', key: 'transactionID', width: 45, },
              { header: 'Merchant', key: 'merchant', width: 12, },
              { header: 'Amount', key: 'amount', width: 14, },
              { header: 'Date', key: 'transactionStartedAt', width: 17, },
              { header: 'receiverAccountNumber', key: 'receiverAccountNumber', width: 17, },
            ];
            worksheet.getRow(1).eachCell((cell) => {
              cell.font = { bold: true };
            });
            const requestParams = event["queryStringParameters"];
    
            let transactions = await TransactionService.getTransactionService(requestParams);
            console.log("transactions ",transactions);
            transactions.forEach(ticket => {
              worksheet.addRow({
                transactionID: ticket["transactionID"],//ticket['name']['first_name'] + ticket['name']['last_name'] ? ticket['name']['first_name'] + ' ' + ticket['name']['last_name'] : ' - ',
                merchant: ticket['merchant']|| '-',
                amount: ticket['amount'] || '-',
                transactionStartedAt: ticket['transactionStartedAt'],
                receiverAccountNumber: ticket['receiverAccountNumber']

              });
            });
            const stream = new Stream.PassThrough();
            const signedUrlExpireSeconds = 60 * 5;
            const uniqueId = uuid();
            const reportKey = `adminReport/${uniqueId}/AdminReport.xlsx`;
            await workbook.xlsx.write(stream);
            const s3 = new AWS.S3();
            const S3params = {
            Bucket: 'fambudget-bucket',
            Key: `primary-users/${uniqueId}/`,
            Body: stream,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
            const S3upload = await s3.upload(S3params).promise();
            const S3signedURL = s3.getSignedUrl("getObject", {
                Bucket: 'fambudget-bucket',
                Key: `primary-users/${uniqueId}/`,
                Expires: signedUrlExpireSeconds
              });
        
            return S3signedURL;
          } catch (error) {
            console.log(error)
            return(error);
          }
      }

}
