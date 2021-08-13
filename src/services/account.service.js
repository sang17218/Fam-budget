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
            await DatabaseUtil.getDbConnection()
            await Account.create(accountDetails)
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }

    static async getAccount(accountDetails){
        try {
            console.log('account getAccount started')
            await DatabaseUtil.getDbConnection()
            const response = await Account.findOne({
                where: {
                    accountNumber: accountDetails["accountNumber"],
                    customerId: accountDetails["customerId"]
                }
            })
            console.log('account getAccount end')
            return response
        } catch (error) {
            console.error('account getAccount error ', error)
            throw new Error("FAILURE")
        }
    }

}
