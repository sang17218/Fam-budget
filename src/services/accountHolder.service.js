const { DatabaseUtil } = require("../utils/database.util")
const {AccountHolder} = require("../../models/accountHolder.model")
const {AuthUtil} = require("../utils/auth.util")

module.exports.AccountHolderService = class AccountHolderService {
    static async modifyKycStatus(userDetails) {
        try {
            console.log('primary account holder details ',userDetails)
            await DatabaseUtil.getDbConnection()
            await AccountHolder.update({
                isKycVerified: userDetails["isKycVerified"],
                isActive: userDetails["isActive"]
            },{
                where: {customerId: userDetails["customerId"]}
            }
            )
            await AuthUtil.enableCognitoUser(userDetails["customerId"])
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }
    
    static async disablePrimaryAccountHolder(userDetails){
        try {
            console.log('disablePrimaryAccountHolder service start')
            await DatabaseUtil.getDbConnection()
            await AccountHolder.update({
                isActive: false
            },{
                where: {customerId: userDetails["customerId"]}
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
}
