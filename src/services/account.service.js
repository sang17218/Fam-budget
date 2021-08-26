const { DatabaseUtil } = require("../utils/database.util")
const {Account} = require("../../models/account.model")
const random = require('random-number')
const {FUSION_CONSTANTS} = require('../constants/application.constants')
const {axiosDefaults} = require('../utils/axios.util')
const axios = axiosDefaults()

const randGenerator = random.generator({
    min: 1111111111,
    max: 9999999999,
    integer: true
})
module.exports.AccountService = class AccountService {
    static async createAccountService(accountDetails) {
        try {
            console.log("Inside Account Service")
            const response = await axios.post(`bundles/${FUSION_CONSTANTS.bundleID}/issueBundle`, {
                "accountHolderID": accountDetails["accountHolderID"],//"0ed2dc3b-7374-48ee-908f-5919b31f9f11",
                "name": `Fampaywalletbundle9adcf36`,
                "phoneNumber": accountDetails["phoneNumber"],
            })
            return response?.data
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }

    static async getAccount(accountID){
        try {
            console.log('account getAccount started')
            const response = await axios.get(`accounts/${accountID}`);
            // await DatabaseUtil.getDbConnection()
            // const response = await Account.findOne({
            //     where: {
            //         accountNumber: accountDetails["accountNumber"],
            //         customerId: accountDetails["customerId"]
            //     }
            // })
            console.log('account getAccount end')
            return response.data
        } catch (error) {
            console.error('account getAccount error ', error)
            throw new Error("FAILURE")
        }
    }

}
