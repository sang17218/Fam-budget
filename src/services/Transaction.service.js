const { AuthUtil } = require("../utils/auth.util")
const {AccountHolder} = require("../../models/accountHolder.model")

const {SecondaryAccountHolder} = require("../../models/secondaryHolder.model")
const {Account} = require("../../models/account.model")

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
                        }

                         
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
    static async getTransactionService(event){
        try {
            console.log('user details ', event)
            // if(userDetails["panCard"])
            await DatabaseUtil.getDbConnection();
            const body = JSON.parse(event.body)
            let {accountNumber,secondaryId , startDate,endDate} = body
            startDate = startDate ? startDate : '1970-01-01'
            const currDate = new Date();
            endDate = endDate ? endDate + ' 18:29:59' : currDate.toISOString().split('T')[0] + ' ' + currDate.toTimeString().split(' ')[0];
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

                //console.log("PrimaryUser Transaction ",primaryUserTransaction);
                return secondaryUserTransaction
            }
            else{
                const primaryUserTransaction = await Account.findAll({
                    where:{
                        accountNumber: accountNumber,
                        createdAt: { [Op.between]: [startDate, endDate] },
                    }
                })
                if(!primaryUserTransaction){
                    throw new Error("Invalid Account Info") 
                }
                return primaryUserTransaction

            }
            
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}
