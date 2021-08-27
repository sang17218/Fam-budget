const { DatabaseUtil } = require("../utils/database.util")
const {Account} = require("../../models/account.model")
const {SecondaryAccountHolder} = require("../../models/secondaryHolder.model")
const { AuthUtil } = require("../utils/auth.util")
const {v4} = require('uuid')
const {Op} = require("sequelize");
const { AccountService } = require("./account.service");
const { axiosDefaults } = require("../utils/axios.util");
const { FUSION_CONSTANTS } = require("../constants/application.constants");
const axios = axiosDefaults()
module.exports.secondaryUserService = class secondaryUserService {

    static async createSecondaryAccountService(userInfo) {
        try {
            // console.log('createSecondaryAccountHolder started ', userInfo)
            const dob = new Date(userInfo["dob"])
            const todayYear = new Date().getFullYear()
            let isMinor = false
            if(todayYear - dob.getFullYear() < 18){
                isMinor = true
            }
            
            const responseFromCreateApplication = await axios.post('applications/newIndividual', {
                "ifiID": FUSION_CONSTANTS.ifiID,
                "formID": `fam-budget-secondary-${v4().slice(0,5)}`,
                // "spoolID": "123",
                "individualType": "REAL",
                "salutation": userInfo["salutation"],
                "firstName": userInfo["firstName"],
                "lastName": userInfo["lastName"],

                "applicationType": "SECONDARY_ACCOUNT_HOLDER",
                "dob": {
                    "year": dob.getFullYear(),
                    "month": dob.getMonth()+1,
                    "day": dob.getDate()
                },
                "gender": userInfo["gender"],
                "kycDetails": {
                    "kycStatus": "MINIMAL",
                    "kycStatusPostExpiry": "string",
                    "kycAttributes": {},
                    "authData": {
                        "AADHAAR": userInfo["adhaarId"]
                    },
                    "authType": "AADHAAR"
                },
                "vectors": [
                    {
                        "type": "p",
                        "value": userInfo["mobile"],
                        "isVerified": true
                    },
                    {
                        "type": "e",
                        "value": userInfo["email"],
                        "isVerified": true
                    }
                ],
                // "pops": [],
                "customFields": {
                    fundsAllocated: userInfo["fundsAllocated"], 
                    isMinor: isMinor,
                    primaryAccountHolderId: userInfo["primaryAccountHolderId"],
                    primaryAccount: userInfo["primaryAccount"],
                    relationship: userInfo["relationship"]
                }
            })

            console.log(responseFromCreateApplication?.data)
            if(responseFromCreateApplication?.data?.status !== 'REJECTED'){
                const responseFromCreateBundle = await AccountService.createAccountService({
                    phoneNumber: userInfo["mobile"],
                    accountHolderID: responseFromCreateApplication?.data?.individualID
                })
    
                console.log('accountNumber ',responseFromCreateBundle?.accounts?.[0]?.accountID, 
                'applicationId :', responseFromCreateApplication?.data?.applicationID,
                  'accountType: ', "SECONDARY_ACCOUNT_HOLDER",
                  'accountHolderID: ', responseFromCreateApplication?.data?.individualID)
    
                const responseFromAccountInsertion = await Account.create({
                    accountNumber: responseFromCreateBundle?.accounts?.[0]?.accountID,
                    applicationId: responseFromCreateApplication?.data?.applicationID,
                    // customerId: responseFromCreateApplication?.data?.individualID,
                    accountType:"SECONDARY_ACCOUNT_HOLDER"
                })
    
                const response = await SecondaryAccountHolder.create({
                    secondaryId:   responseFromCreateApplication?.data?.individualID,
                    primaryUserAccountNumber:  userInfo["primaryAccount"],
                    secondaryUserAccountNumber: responseFromCreateBundle?.accounts?.[0]?.accountID,
                    relationship:  userInfo["relationship"],
                    isMinor: isMinor,
                })

                userInfo["username"] = responseFromCreateApplication?.data?.individualID
                userInfo["role"] = 'secondary-account-holder'

                await AuthUtil.adminCreateUser(userInfo)
                // await AuthUtil.disableCognitoUser(userDetails.username) 
                await AuthUtil.addToGroup(userInfo.username, 'secondary-account-holder')  
    
                console.log('createSecondaryAccountHolder service end')
                return "SUCCESS"
            }
            throw new Error("Application Rejected")
        } catch (error) {
            console.error('error in createSecondaryAccountHolder ', error)
            throw new Error("FAILURE")
        }
    }

    // reports 
    static async getSecondaryAccountService(accountDetails) {
        try {
            console.log('secondary account details ', accountDetails)
            const secondaryUsers = []
            let getAllSecondaryAccounts = []
            
            getAllSecondaryAccounts = await SecondaryAccountHolder.findAll({
                where:{
                    primaryUserAccountNumber: accountDetails["primaryUserAccountNumber"]
                }
            })
            for(let ind=0; ind<getAllSecondaryAccounts.length; ind++){
                const user = await axios.get(`/accountHolders/${getAllSecondaryAccounts[ind]["secondaryId"]}`)
                secondaryUsers.push({
                    ...getAllSecondaryAccounts[ind]?.dataValues,
                    ...user["data"]
                })
            }

            // console.log(secondaryUsers)
            
            return secondaryUsers;
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }



    // static async createSecondaryAccountService(accountDetails) {
    //     try {
    //         console.log('secondary account details ', accountDetails)
    //         // const { accountHolder, ...account} = {...accountDetails };
    //         await DatabaseUtil.getDbConnection()
    //         const accountNumber = accountDetails["accountNumber"];
    //         const fundsRequested =  accountDetails["fundsAllocated"]
            
    //         const AccountBalance = await Account.findOne({
    //             where:{
    //                 accountNumber:accountNumber,
    //                 balance: {
    //                 [Op.gt]: fundsRequested,
    //             }
    //         }
    //         })
    //         if(!AccountBalance){
    //             throw new Error("Insufficient Funds")
    //         }
    //         const currentBalance =  AccountBalance.balance;
    //         console.log("Account Balance ",currentBalance);
    //          await Account.update({
    //              balance: currentBalance-fundsRequested},
    //              {where: {
    //                 accountNumber:accountNumber,
    //         }});
    //         const response = await SecondaryAccountHolder.create(accountDetails)

    //         //console.log("Response ",response.secondaryId);
    //         accountDetails["username"] = response.secondaryId
    //         accountDetails["role"] = 'Secondary-Account-Holder'
    //         await AuthUtil.adminCreateUser(accountDetails)
    //         await AuthUtil.disableCognitoUser(accountDetails["username"])

            
    //         return "Secondary User Created Successfully"
    //     }catch (error) {
    //         console.error(error)
    //         throw new Error(error)
    //     }
    // }
    static async deleteSecondaryAccountService(accountDetails) {
        try {
            console.log('secondary account details ')
            // const { accountHolder, ...account} = {...accountDetails };
            // await DatabaseUtil.getDbConnection()
            
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
    // static async getSecondaryAccountService(accountDetails) {
    //     try {
    //         console.log('secondary account details ')
    //         // const { accountHolder, ...account} = {...accountDetails };
    //         if (!accountDetails["accountNumber"]){
    //             throw new Error("Required Params Not Present")
    //         } 
    //         await DatabaseUtil.getDbConnection()
    //         const accountNumber = accountDetails["accountNumber"];
    //         const getAllSecondaryAccounts = await SecondaryAccountHolder.findAll({
    //             where:{
    //                 accountNumber:accountNumber
    //             }
    //         })
    //         return getAllSecondaryAccounts;
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error(error)
    //     }
    // }
    // static async addFunds(accountDetails) {
    //     try {
    //         const accountNumber = accountDetails["accountNumber"];
    //         const secondaryId = accountDetails["secondaryId"];
    //         const amount = accountDetails["amount"];
    //         //let { accountNumber , secondaryId ,amount  } = requestParams
    //         if (!accountNumber){
    //             throw new Error("Required Params Not Present")
    //         } 
    //         await DatabaseUtil.getDbConnection()
    //         const getBalance = await Account.findOne({
    //             where:{
    //                 accountNumber: accountNumber,
    //             },attributes:['balance' , 'minimumBalance']
    //         })
    //         console.log("GETT ",getBalance.balance,amount)
    //         if( getBalance.balance>=amount ){
    //             const fundsPresent = await SecondaryAccountHolder.findOne({
    //                 where: { 
    //                     secondaryId: secondaryId,
    //                     isActive:true
                         
    //                 },attributes:["fundsAllocated"]
    //             })
    //             const addFunds = await SecondaryAccountHolder.update({
    //                 fundsAllocated: fundsPresent.fundsAllocated+amount},{

    //                 where:{
    //                     accountNumber:accountNumber,
    //                     secondaryId: secondaryId
    //                 }
    //             })
    //             const reduceFunds = await Account.update({
    //                 balance: getBalance.balance-amount},{

    //                 where:{
    //                     accountNumber:accountNumber,
    //                 }
    //             })
    //             return "Success"

    //         }
    //         else{
    //              throw new Error("Insufficient Balance")
    //         }

            
            
            
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error(error)
    //     }
    // }
}