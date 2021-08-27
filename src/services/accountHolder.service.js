const { DatabaseUtil } = require("../utils/database.util")
const { Account } = require("../../models/account.model")
const { AuthUtil } = require("../utils/auth.util")
const {axiosDefaults} = require('../utils/axios.util')
const {FUSION_CONSTANTS} = require('../constants/application.constants')
const {v4} = require('uuid')
const axios = axiosDefaults()

const AWS = require("aws-sdk")
const { AccountService } = require("./account.service")

module.exports.AccountHolderService= class AccountHolderService {

    static async createPrimaryAccountHolder(userInfo) {
        try {
            console.log('createPrimaryAccountHolder started ', userInfo)
            const dob = new Date(userInfo["dob"])
            
            const responseFromCreateApplication = await axios.post('applications/newIndividual', {
                "ifiID": FUSION_CONSTANTS.ifiID,
                "formID": `fam-budget-${v4().slice(0,5)}`,
                // "spoolID": "123",
                "individualType": "REAL",
                "salutation": userInfo["salutation"],
                "firstName": userInfo["firstName"],
                "lastName": userInfo["lastName"],

                "applicationType": "PRIMARY_ACCOUNT_HOLDER",
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
                    actualBalance: 0.0,
                    secondaryUserIds: []
                }
            })

            const responseFromCreateBundle = await AccountService.createAccountService({
                phoneNumber: userInfo["mobile"],
                accountHolderID: responseFromCreateApplication?.data?.individualID
            })

            console.log('accountNumber ',responseFromCreateBundle?.accounts?.[0]?.accountID, 
            'applicationId :', responseFromCreateApplication?.data?.applicationID,
             'customerId: ', responseFromCreateApplication?.data?.individualID,
              'accountType: ', "PRIMARY_ACCOUNT_HOLDER",
              'accountHolderID: ', responseFromCreateApplication?.data?.individualID)

            const response = await Account.create({
                accountNumber: responseFromCreateBundle?.accounts?.[0]?.accountID,
                applicationId: responseFromCreateApplication?.data?.applicationID,
                customerId: responseFromCreateApplication?.data?.individualID,
                accountType: "PRIMARY_ACCOUNT_HOLDER"
            })

            userInfo["username"] = responseFromCreateApplication?.data?.individualID
            userInfo["role"] = 'primary-account-holder'

            await AuthUtil.adminCreateUser(userInfo)
            // await AuthUtil.disableCognitoUser(userDetails.username) 
            await AuthUtil.addToGroup(userInfo.username, 'primary-account-holder')  


            return "SUCCESS"
        } catch (error) {
            console.error('error in createPrimaryAccountHolder ', error)
            throw new Error("FAILURE")
        }
    }

    static async getPrimaryAccountHolderDetails(userInfo){
        try {
            // console.log('getPrimaryAccountHolderDetails started ', userInfo)
            const response = await axios.get(`/accountHolders/${userInfo["accountHolderId"]}`)
            // console.log(response.data)
            console.log('getPrimaryAccountHolderDetails end')
            return response.data
        } catch (error) {
            console.error('error in getPrimaryAccountHolderDetails ', error)
            throw new Error("FAILURE")           
        }
    }



    // static async modifyKycStatus(userDetails) {
    //     try {
    //         console.log('primary account holder details ', userDetails)
    //         await DatabaseUtil.getDbConnection()
    //         await AccountHolder.update({
    //             isKycVerified: userDetails["isKycVerified"],
    //             isActive: userDetails["isActive"]
    //         }, {
    //             where: { customerId: userDetails["customerId"] }
    //         }
    //         )
    //         await AuthUtil.enableCognitoUser(userDetails["customerId"])
    //         return "SUCCESS"
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error("FAILURE")
    //     }
    // }

    // static async disablePrimaryAccountHolder(userDetails) {
    //     try {
    //         console.log('disablePrimaryAccountHolder service start')
    //         await DatabaseUtil.getDbConnection()
    //         await AccountHolder.update({
    //             isActive: false
    //         }, {
    //             where: { customerId: userDetails["customerId"] }
    //         }
    //         )
    //         await AuthUtil.disableCognitoUser(userDetails["customerId"])
    //         console.log('disablePrimaryAccountHolder service end')
    //         return "SUCCESS"
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error("FAILURE")
    //     }
    // }


    // static async generateKycUrl(userDetails) {
    //     try {
    //         const customerId = userDetails["customerId"]
    //         console.log('generateKycUrl service start')
    //         const kycUrls = []
    //         const s3 = new AWS.S3();
    //         const getObject = await s3.listObjects({
    //             Bucket:'fambudget-bucket',
    //             Prefix: `primary-users/kyc/${customerId}/`
    //         }).promise()

    //         const files = getObject.Contents

    //         for(let ind=0; ind< files.length; ind+=1){
    //             kycUrls.push(
    //                 {
    //                     key: files[ind].Key,
    //                    url: 
    //                     await s3.getSignedUrlPromise('getObject', {
    //                     Bucket: 'fambudget-bucket',
    //                     Key: files[ind].Key, //filename
    //                     Expires: 3600, //time to expire in seconds
    //                 })
    //                 })
    //         }
    //         console.log('generateKycUrl service end')
    //         return kycUrls
    //     } catch (error) {
    //         console.error(error)
    //         throw new Error("FAILURE")
    //     }
    // }

    // static async getAccountHolder(customerDetails){
    //     try {
    //         console.log('getAccountHolder started')
    //         await DatabaseUtil.getDbConnection()
    //         const response = await AccountHolder.findOne({
    //             where: {
    //                 customerId: customerDetails["customerId"]
    //             }
    //         })
    //         console.log('getAccountHolder end')
    //         return response
    //     } catch (error) {
    //         console.error('getAccountHolder error ', error)
    //         throw new Error("FAILURE")
    //     }
    // }

}
