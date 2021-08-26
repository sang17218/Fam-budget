const { AccountService } = require("../../services/account.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.createAccount= async function createAccount(event){
    const body = JSON.parse(event.body)
    try {
      console.log("createAccount api started")
      const response = await AccountService.createPrimaryAccountService(body)
      console.log("createAccount api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}
