//const { AuthUtil } = require("../utils/auth.util")
const {AccountHolder} = require("../../models/accountHolder.model")
const uuid  = require("uuid").v4

const {SecondaryAccountHolder} = require("../../models/secondaryHolder.model")
const {Account} = require("../../models/account.model")
const {Transaction} = require("../../models/transaction.model")
const {axiosDefaults} = require('../utils/axios.util')
const {FUSION_CONSTANTS} = require('../constants/application.constants')
const {v4} = require('uuid')
const axios = axiosDefaults()

const {DatabaseUtil} = require("../utils/database.util")
const {Op} = require("sequelize");
module.exports.TransactionService = class TransactionService{
    static async createTransactionService(transactionDetails){
        try {
            console.log('transaction details ', transactionDetails)

            const amount = transactionDetails["amount"]
            const currency = amount.currency;
            const amount2 = amount.amount
            const response = await axios.post(`transfers`, {
                "requestID": v4(),//"8439oknhvutcvh44429ut",
                "amount": {
                  "currency": currency,
                  "amount": amount2
                },
                "transferCode": "ATLAS_P2M_AUTH",
                "debitAccountID": transactionDetails["debitAccountID"], //"4a48c784-dfdb-4b43-86f6-7d875bbd751d",
                "creditAccountID": transactionDetails["creditAccountID"], // "31f1e723-17a4-496c-ba51-da4be3c927fb",
                "transferTime": 1574741608000,
                "remarks": "Fund transfer test",
                "attributes": {}
              })
            return response.data;


            // // if(userDetails["panCard"])
            //  await DatabaseUtil.getDbConnection()

            // const { senderAccountNumber , receiverAccountNumber, amount , secondaryId }  = transactionDetails
            // console.log("Amount ",amount)
            // const getBalance = await Account.findOne({
            //     where:{
            //         accountNumber: senderAccountNumber,
            //     },attributes:['balance' , 'minimumBalance']
            // })
            // if (!getBalance){
            //     throw  new Error("Account Not Found")
            // }
            // if (secondaryId){
            //     const fundsPresent = await SecondaryAccountHolder.findOne({
            //         where: { 
            //             secondaryId: secondaryId,
            //             fundsAllocated:{
            //                 [Op.gte]: amount,
            //             },
            //             isActive:true
                         
            //         },attributes:["fundsAllocated"]
            //     })
            //     if( !fundsPresent){
            //         throw  new Error("Insufficient Funds")
            //     }
            //     console.log("Funds are Present", fundsPresent)
            //     const secTrans = await SecondaryAccountHolder.update({
            //         fundsAllocated: fundsPresent.fundsAllocated-amount},
            //         {
            //             where : {
            //                 secondaryId:secondaryId
            //            } 
            //         })
            //         await Account.update({
            //             balance:getBalance.balance-amount},
            //             {where : {
            //              accountNumber:senderAccountNumber
            //             }
            //         })
            //         transactionDetails["transactionID"] = uuid();
            //         transactionDetails["transactionEndedAt"] = new Date()
            //         transactionDetails["isSuccessful"] = true
            //         transactionDetails["senderSecondary"] = true
            //         // transactionDetails["description"] = "Debited"

            //         //transactionDetails["accountNumber"] = senderAccountNumber;

            //         console.log("Transactions  ",transactionDetails)
            //         await Transaction.create(transactionDetails)

            //     return "SUCCESS"



            // }
            // else{
            //     console.log("inside account ");
            //     if(getBalance && ((getBalance.balance)-amount)>getBalance.minimumBalance){
                    
            //        await Account.update({
            //            balance:getBalance.balance-amount},
            //            {where : {
            //             accountNumber:senderAccountNumber
            //            }
            //        })
            //         transactionDetails["transactionID"] = uuid();
            //         transactionDetails["transactionEndedAt"] = new Date()
            //         transactionDetails["isSuccessful"] = true
            //         transactionDetails["senderSecondary"] = true
            //         transactionDetails["description"] = "Debited"
            //         await Transaction.create(transactionDetails)
                    
            //     }
            //     else{
            //         throw  new Error("Transaction Failed due to Insufficient Balance")
            //     }
            //     return "SUCCESS"
            // }
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async getTransactionService(accountID,requestPayload){
        try {
            //console.log('user details ', requestPayload)
            const pageNumber= requestPayload["pageNumber"];//1;
            const pageSize = requestPayload["pageSize"];//5
            const response = await axios.get(`accounts/${accountID}/transactions`, {
                params: {
                    pageNumber: pageNumber,
                    pageSize: pageSize
                }
              });
            return response.data;
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}
