const { DatabaseUtil } = require("../utils/database.util")
const ExcelJS = require('exceljs');
const {Op} = require("sequelize");
const uuid = require("uuid").v4
// const { SecondaryAccountHolder } = require("../../models/secondaryHolder.model");
// const { Account } = require("../../models/account.model");
const { TransactionService } = require("./Transaction.service");
const {axiosDefaults} = require('../utils/axios.util')
const {FUSION_CONSTANTS} = require('../constants/application.constants')
const {v4} = require('uuid')
const axios = axiosDefaults()
const Stream = require('stream');
const AWS = require("aws-sdk")


 
module.exports.ExpenseTrackingService = class ExpenseTrackingService {
    static async getMonthlyOverview(event) {
        try {
            const requestParams = event["queryStringParameters"];
            let { pageNumber , pageSize, accountID  } = requestParams
            const currentYear = new Date().getFullYear()
            const date = new Date();
            const startOfYear = new Date(date.setUTCFullYear(currentYear,0,1));
            
            startOfYear.setUTCHours(0, 0 , 0);
            const start = startOfYear.getTime()
            const yearlyTransactions = await axios.get(`accounts/${accountID}/transactions`, {
                params: {
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    startingAfter:start,
                    endingBefore: new Date().getTime()
                }
              });
            console.log("After YEARLY TRANSACTIONS ",yearlyTransactions.data)
            //while(response)
            // const { accountHolder, ...account} = {...accountDetails };
            // let where;
            // if(secondaryId){

            //     where ={
            //         senderAccountNumber: accountNumber,
            //         secondaryId:secondaryId,
            //         transactionStartedAt: { [Op.gte]: startOfYear, }

            //     }

            // }
            // else{
            //     where = {
            //         senderAccountNumber: accountNumber,
            //         transactionStartedAt: { [Op.gte]: startOfYear, }
            //     }

            // }

            // await DatabaseUtil.getDbConnection()
            // const yearlyTransactions = await Transaction.findAll({
            //     where: where
            // })
            // console.log("Yearly ",yearlyTransactions);

            const yearlyTransactionsData = yearlyTransactions.data.accountTransactionList
            const Months = { "Jan" :0 , "Feb" : 0 ,"March" :0 , "Apr" : 0 ,"May":0,"Jun":0,"July":0,"Aug":0,"Sept":0,"Oct":0,"Nov":0,"Dec":0}

            for(let transaction of yearlyTransactionsData){
                const startedAt = new Date(transaction["timestamp"]);
                console.log("Started ",startedAt);
                const month = new Date(startedAt);
                const getMonth = month.getMonth();
                const amount = transaction["amount"];
                if(getMonth == 0){
                    Months["Jan"]+=amount
                }
                else if(getMonth == 1){
                    Months["Feb"]+=amount
                }
                else if(getMonth == 2){
                    Months["Mar"]+=amount
                }
                else if(getMonth == 3){
                    Months["Apr"]+=amount
                }
                else if(getMonth == 4){
                    Months["May"]+=amount
                }
                else if(getMonth == 5){
                    Months["Jun"]+=amount
                }
                else if(getMonth == 6){
                    Months["July"]+=amount
                }
                else if(getMonth == 7){
                    Months["Aug"]+=amount
                }

                else if(getMonth == 8){
                    Months["Sept"]+=amount
                }

                else if(getMonth == 9){
                    Months["Oct"]+=amount
                }

                else if(getMonth == 10){
                    Months["Nov"]+=amount
                }

                else if(getMonth == 11){
                    Months["Dec"]+=amount
                }




            }
            return Months
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async getRecentTransaction(event) {
        try {
            
             const requestParams = event["queryStringParameters"];
             console.log('Recent Transaction  ', requestParams)
             let { accountID  } = requestParams
            // const { accountHolder, ...account} = {...accountDetails };
            const response = await axios.get(`accounts/${accountID}/transactions`, {
                params: {
                    pageNumber: 1,
                    pageSize: 5,
                    
                }
              });
              return response.data;
            

            
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
            Key: `primary-users/reports/${uniqueId}/AdminReport.xlsx`,
            Body: stream,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            };
            const S3upload = await s3.upload(S3params).promise();
            const S3signedURL = await  s3.getSignedUrlPromise("getObject", {
                Bucket: 'fambudget-bucket',
                Key: `primary-users/reports/${uniqueId}/AdminReport.xlsx`,
                Expires: signedUrlExpireSeconds
              })
        
            return S3signedURL;
          } catch (error) {
            console.log(error)
            return(error);
          }
      }

}
