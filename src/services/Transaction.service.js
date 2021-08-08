//const { AuthUtil } = require("../utils/auth.util")
const {AccountHolder} = require("../../models/accountHolder.model")
const uuid  = require("uuid").v4

const {SecondaryAccountHolder} = require("../../models/secondaryHolder.model")
const {Account} = require("../../models/account.model")
const {Transaction} = require("../../models/transaction.model")

const {DatabaseUtil} = require("../utils/database.util")
const {Op} = require("sequelize");
module.exports.TransactionService = class TransactionService{
    static async createTransactionService(transactionDetails){
        try {
            console.log('transaction details ', transactionDetails)

            // if(userDetails["panCard"])
             await DatabaseUtil.getDbConnection()

            const { senderAccountNumber , receiverAccountNumber, amount , secondaryId }  = transactionDetails
            console.log("Amount ",amount)
            const getBalance = await Account.findOne({
                where:{
                    accountNumber: senderAccountNumber,
                },attributes:['balance' , 'minimumBalance']
            })
            if (!getBalance){
                throw  new Error("Account Not Found")
            }
            if (secondaryId){
                const fundsPresent = await SecondaryAccountHolder.findOne({
                    where: { 
                        secondaryId: secondaryId,
                        fundsAllocated:{
                            [Op.gte]: amount,
                        },
                        isActive:true
                         
                    },attributes:["fundsAllocated"]
                })
                if( !fundsPresent){
                    throw  new Error("Insufficient Funds")
                }
                console.log("Funds are Present", fundsPresent)
                const secTrans = await SecondaryAccountHolder.update({
                    fundsAllocated: fundsPresent.fundsAllocated-amount},
                    {
                        where : {
                            secondaryId:secondaryId
                       } 
                    })
                    await Account.update({
                        balance:getBalance.balance-amount},
                        {where : {
                         accountNumber:senderAccountNumber
                        }
                    })
                    transactionDetails["transactionID"] = uuid();
                    transactionDetails["transactionEndedAt"] = new Date()
                    transactionDetails["isSuccessful"] = true
                    transactionDetails["senderSecondary"] = true
                    transactionDetails["description"] = "Debited"

                    //transactionDetails["accountNumber"] = senderAccountNumber;

                    console.log("Transactions  ",transactionDetails)
                    await Transaction.create(transactionDetails)

                return "SUCCESS"



            }
            else{
                console.log("inside account ");
                if(getBalance && ((getBalance.balance)-amount)>getBalance.minimumBalance){
                    
                   await Account.update({
                       balance:getBalance.balance-amount},
                       {where : {
                        accountNumber:senderAccountNumber
                       }
                   })
                    transactionDetails["transactionID"] = uuid();
                    transactionDetails["transactionEndedAt"] = new Date()
                    transactionDetails["isSuccessful"] = true
                    transactionDetails["senderSecondary"] = true
                    transactionDetails["description"] = "Debited"
                    await Transaction.create(transactionDetails)
                    
                }
                else{
                    throw  new Error("Transaction Failed due to Insufficient Balance")
                }
                return "SUCCESS"
            }
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async getTransactionService(requestPayload){
        try {
            console.log('user details ', requestPayload)
            // if(userDetails["panCard"])
            await DatabaseUtil.getDbConnection();
            let {accountNumber,secondaryId , customerId,startDate,endDate,transactionType} = requestPayload
            
            startDate = startDate ? startDate : '1970-01-01'
            const currDate = new Date();
            endDate = endDate ? endDate + ' 18:29:59' : currDate.toISOString().split('T')[0] + ' ' + currDate.toTimeString().split(' ')[0];
            let where;
                if(transactionType ){ //If transaction type is present
                    if(transactionType=="credit"){
                        where = {
                            senderAccountNumber: accountNumber,
                            transactionStartedAt: { [Op.between]: [startDate, endDate] }

                        }
                    }
                    else if(transactionType=="debit"){
                        where = {
                            receiverAccountNumber: accountNumber,
                            transactionStartedAt: { [Op.between]: [startDate, endDate] }

                        }

                    }
                    else{
                        where = {
                            [Op.or]:[{senderAccountNumber: accountNumber}, {receiverAccountNumber: accountNumber}],
                            transactionStartedAt: { [Op.between]: [startDate, endDate] }

                        }

                    }
                }
                else{
                    where = {
                        [Op.or]:[{senderAccountNumber: accountNumber}, {receiverAccountNumber: accountNumber}],
                        transactionStartedAt: { [Op.between]: [startDate, endDate] }

                    }
                }
            if(secondaryId){
                
                const secondaryUserTransaction = await SecondaryAccountHolder.findAll({
                    where: { 
                        secondaryId: secondaryId,
                        createdAt: { [Op.between]: [startDate, endDate] },
                        isActive: false         
                    }
                })
                if(!secondaryUserTransaction){
                    throw new Error("Invalid Account Info") 
                }
                const GetTransactions = await Transaction.findAll({
                    where: where
                })
                    return GetTransactions

                //console.log("PrimaryUser Transaction ",primaryUserTransaction);
            }
            else{
                const checkForPrimaryUser = Account.findOne({
                    where:{
                        customerId:customerId
                    }
                })
                if(!checkForPrimaryUser){
                    throw new Error("Not a Primary User")
                }
                const primaryUserTransaction = await Account.findAll({
                    where:{
                        accountNumber: accountNumber,
                    }
                })

                if(!primaryUserTransaction){
                    throw new Error("Invalid Account Info") 
                }
                
                const GetTransactions = await Transaction.findAll({
                    where: where
                })
                    return GetTransactions

            }    
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}
