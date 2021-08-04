const { DatabaseUtil } = require("../utils/database.util")
const {AccountHolder} = require("../../models/accountHolder.model")
const random = require('random-number')

module.exports.AccountHolderService = class AccountHolderService {
    static async modifyKycStatus(userDetails) {
        try {
            console.log('account holder details ',userDetails)
            await DatabaseUtil.getDbConnection()
            await AccountHolder.update({
                isKycVerified: userDetails["isKycVerified"],
                isActive: userDetails["isActive"]
            },{
                where: {customerId: userDetails["customerId"]}
            }
            )
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}
