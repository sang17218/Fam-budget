const { DatabaseUtil } = require("../utils/database.util")
const {Transaction} = require("../../models/transaction.model")

const {Op} = require("sequelize");
const { SecondaryAccountHolder } = require("../../models/secondaryHolder.model");
const { Account } = require("../../models/account.model");
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
}
