const { DatabaseUtil } = require("../utils/database.util")
const {Account} = require("../../models/account.model")
const random = require('random-number')
const randGenerator = random.generator({
    min: 1111111111,
    max: 9999999999,
    integer: true
})
module.exports.AccountService = class AccountService {
    static async createAccountService(accountDetails) {
        try {
            console.log('account details ', accountDetails)
            // accountDetails["accountNumber"] = randGenerator()
            await DatabaseUtil.getDbConnection()
            // const { accountHolder, ...account} = {...accountDetails };
            // while(await Account.findOne( {where : { accountNumber: accountDetails["accountNumber"]} })){
            //     accountDetails["accountNumber"] = randGenerator()
            // }
            await Account.create(accountDetails)
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }
}
