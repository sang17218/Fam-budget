const { DatabaseUtil } = require("../utils/database.util")
const {Account} = require("../../models/account.model")
const {SecondaryAccountHolder} = require("../../models/secondaryHolder.model")
const { AuthUtil } = require("../utils/auth.util")

const {Op} = require("sequelize");
module.exports.secondaryUserService = class secondaryUserService {
    static async createSecondaryAccountService(accountDetails) {
        try {
            console.log('secondary account details ', accountDetails)
            // const { accountHolder, ...account} = {...accountDetails };
            await DatabaseUtil.getDbConnection()
            const accountNumber = accountDetails["accountNumber"];
            const fundsRequested =  accountDetails["fundsAllocated"]
            
            const AccountBalance = await Account.findOne({
                where:{
                    accountNumber:accountNumber,
                    balance: {
                    [Op.gt]: fundsRequested,
                }
            }
            })
            if(!AccountBalance){
                throw new Error("Insufficient Funds")
            }
            const currentBalance =  AccountBalance.balance;
            console.log("Account Balance ",currentBalance);
             await Account.update({
                 balance: currentBalance-fundsRequested},
                 {where: {
                    accountNumber:accountNumber,
            }});
            const response = await SecondaryAccountHolder.create(accountDetails)

            //console.log("Response ",response.secondaryId);
            accountDetails["username"] = response.secondaryId
            console.log("Username ",accountDetails["username"])
            accountDetails["role"] = 'Secondary-Account-Holder'
            await AuthUtil.adminCreateUser(accountDetails)
            await AuthUtil.disableCognitoUser(accountDetails["username"])

            
            return "Secondary User Created Successfully"
        }catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async deleteSecondaryAccountService(accountDetails) {
        try {
            console.log('secondary account details ', accountDetails)
            // const { accountHolder, ...account} = {...accountDetails };
            if (!accountDetails["secondaryId"]){
                throw new Error("Required Params Not Present")
            } 
            await DatabaseUtil.getDbConnection()
            const secondaryId = accountDetails["secondaryId"];
            await SecondaryAccountHolder.update(
                { isActive: false },
                { where: { secondaryId: secondaryId, } })
            return "Deleted SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async getSecondaryAccountService(accountDetails) {
        try {
            console.log('secondary account details ', accountDetails)
            // const { accountHolder, ...account} = {...accountDetails };
            if (!accountDetails["accountNumber"]){
                throw new Error("Required Params Not Present")
            } 
            await DatabaseUtil.getDbConnection()
            const accountNumber = accountDetails["accountNumber"];
            const getAllSecondaryAccounts = await SecondaryAccountHolder.findAll({
                where:{
                    accountNumber:accountNumber
                }
            })
            return getAllSecondaryAccounts;
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    static async addFunds(accountDetails) {
        try {
            const accountNumber = accountDetails["accountNumber"];
            const secondaryId = accountDetails["secondaryId"];
            const amount = accountDetails["amount"];
            //let { accountNumber , secondaryId ,amount  } = requestParams
            if (!accountNumber){
                throw new Error("Required Params Not Present")
            } 
            await DatabaseUtil.getDbConnection()
            const getBalance = await Account.findOne({
                where:{
                    accountNumber: accountNumber,
                },attributes:['balance' , 'minimumBalance']
            })
            console.log("GETT ",getBalance.balance,amount)
            if( getBalance.balance>=amount ){
                const fundsPresent = await SecondaryAccountHolder.findOne({
                    where: { 
                        secondaryId: secondaryId,
                        isActive:true
                         
                    },attributes:["fundsAllocated"]
                })
                const addFunds = await SecondaryAccountHolder.update({
                    fundsAllocated: fundsPresent.fundsAllocated+amount},{

                    where:{
                        accountNumber:accountNumber,
                        secondaryId: secondaryId
                    }
                })
                const reduceFunds = await Account.update({
                    balance: getBalance.balance-amount},{

                    where:{
                        accountNumber:accountNumber,
                    }
                })
                return "Success"

            }
            else{
                 throw new Error("Insufficient Balance")
            }

            
            
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}