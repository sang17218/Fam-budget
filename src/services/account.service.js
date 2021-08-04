const { DatabaseUtil } = require("../utils/database.util")
const {Account} = require("../../models/account.model")
const random = require('random-number')
randGenerator = random.generator({
    min: 1111111111,
    max: 9999999999,
    integer: true
})
module.exports.AccountService = class AccountService {
    static async createAccountService(accountDetails) {
        try {
            console.log('account details ', accountDetails)
            // const { accountHolder, ...account} = {...accountDetails };
            accountDetails["accountNumber"] = randGenerator()
            await DatabaseUtil.getDbConnection()
            await Account.create(accountDetails)
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}
