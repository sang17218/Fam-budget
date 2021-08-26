//const { AuthUtil } = require("../utils/auth.util")
const {axiosDefaults} = require('../utils/axios.util')
const {FUSION_CONSTANTS} = require('../constants/application.constants')
const {v4} = require('uuid')
const axios = axiosDefaults()

const { Account } = require("../../models/account.model")
const { SecondaryAccountHolder } = require("../../models/secondaryHolder.model")

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
            const accountType = transactionDetails["accountType"];
            const getBalanceForSender = await Account.findOne({
                    where:{
                        accountNumber: transactionDetails["debitAccountID"],
                    },attributes:['balance']
                })
            const getBalanceForReciever = await Account.findOne({
                    where:{
                        accountNumber: transactionDetails["creditAccountID"],
                    },attributes:['balance']
                })
            await Account.update({
                             balance:getBalanceForSender.balance-amount},
                             {where : {
                              accountNumber:transactionDetails["debitAccountID"],
                             }
                         })
            await Account.update({
                            balance:getBalanceForReciever.balance+amount},
                            {where : {
                             accountNumber:transactionDetails["creditAccountID"],
                            }
                        })
            if(accountType == "SECONDARY_ACCOUNT_HOLDER"){
                const getBalanceForSender = await SecondaryAccountHolder.findOne({
                    where:{
                        secondaryUserAccountNumber: transactionDetails["debitAccountID"],
                    },attributes:['fundsSpend','secondaryUserAccountNumber']
                }).then(()=>{
                    await SecondaryAccountHolder.update({
                        fundsSpent:getBalanceForSender.fundsSpend-amount},
                        {where : {
                        accountNumber:transactionDetails["debitAccountID"],
                        }
                    })
                })
                const getBalanceForReciever = await SecondaryAccountHolder.findOne({
                        where:{
                            secondaryUserAccountNumber: transactionDetails["creditAccountID"],
                        },attributes:['fundsSpend','secondaryUserAccountNumber']
                    }).then(()=>{
                        await SecondaryAccountHolder.update({
                            fundsSpent:getBalanceForReciever.fundsSpend+amount},
                            {where : {
                            accountNumber:transactionDetails["creditAccountID"],
                            }
                        })    
                    })

                
        }
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
            //while(response)
            console.log("Response ",response.data);
            return response.data;
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}
