const { secondaryUserService } = require("../../services/secondaryUser.service")

module.exports.createSecondaryUser= async function createSecondaryUser(event){
    const body = JSON.parse(event.body)
    try {
      console.log("create SecondaryUser api started")
      const response = await secondaryUserService.createSecondaryAccountService(body)
      console.log("create SecondaryUser api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error.message)
      }
    }
}
