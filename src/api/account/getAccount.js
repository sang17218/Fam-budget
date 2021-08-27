const { AccountService} = require("../../services/account.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.getAccount = async function getAccount (event){
    try {
      console.log("getAccount  api started")
      const requestParams = event.pathParameters.accountID;
      const response = await AccountService.getAccount(requestParams)
      console.log("getAccount api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('getAccount error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}

