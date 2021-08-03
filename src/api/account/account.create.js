const { AccountService } = require("../../services/account.service")

module.exports.createAccount= async function createAccount(event){
    const body = JSON.parse(event.body)
    try {
      console.log("createAccount api started")
      const response = await AccountService.createAccountService(body)
      console.log("createAccount api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}
