const { secondaryUserService } = require("../../services/secondaryUser.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.getAllSecondaryUsers= async function getAllSecondaryUsers(event){
    const body = JSON.parse(event.body)
    try {
      console.log("GET all SecondaryUser api started" )
      const response = await secondaryUserService.getSecondaryAccountService(body)
      console.log("get all SecondaryUser api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error.message),
        headers: DEFAULT_HEADERS
      }
    }
}
