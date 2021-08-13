const { DatabaseUtil } = require("../utils/database.util")
const { AccountHolder } = require("../../models/accountHolder.model")
const { AuthUtil } = require("../utils/auth.util")
const AWS = require("aws-sdk")
module.exports.AccountHolderService = class AccountHolderService {
    static async modifyKycStatus(userDetails) {
        try {
            console.log('primary account holder details ', userDetails)
            await DatabaseUtil.getDbConnection()
            await AccountHolder.update({
                isKycVerified: userDetails["isKycVerified"],
                isActive: userDetails["isActive"]
            }, {
                where: { customerId: userDetails["customerId"] }
            }
            )
            await AuthUtil.enableCognitoUser(userDetails["customerId"])
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }

    static async disablePrimaryAccountHolder(userDetails) {
        try {
            console.log('disablePrimaryAccountHolder service start')
            await DatabaseUtil.getDbConnection()
            await AccountHolder.update({
                isActive: false
            }, {
                where: { customerId: userDetails["customerId"] }
            }
            )
            await AuthUtil.disableCognitoUser(userDetails["customerId"])
            console.log('disablePrimaryAccountHolder service end')
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }


    static async generateKycUrl(userDetails) {
        try {
            const customerId = userDetails["customerId"]
            console.log('generateKycUrl service start')
            const kycUrls = []
            const s3 = new AWS.S3();
            const getObject = await s3.listObjects({
                Bucket:'fambudget-bucket',
                Prefix: `primary-users/kyc/${customerId}/`
            }).promise()

            const files = getObject.Contents

            for(let ind=0; ind< files.length; ind+=1){
                kycUrls.push(
                    {
                        key: files[ind].Key,
                       url: 
                        await s3.getSignedUrlPromise('getObject', {
                        Bucket: 'fambudget-bucket',
                        Key: files[ind].Key, //filename
                        Expires: 3600, //time to expire in seconds
                    })
                    })
            }
            console.log('generateKycUrl service end')
            return kycUrls
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }

    static async getAccountHolder(customerDetails){
        try {
            console.log('getAccountHolder started')
            await DatabaseUtil.getDbConnection()
            const response = await AccountHolder.findOne({
                where: {
                    customerId: customerDetails["customerId"]
                }
            })
            console.log('getAccountHolder end')
            return response
        } catch (error) {
            console.error('getAccountHolder error ', error)
            throw new Error("FAILURE")
        }
    }

}
