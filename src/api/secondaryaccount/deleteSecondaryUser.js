const { secondaryUserService } = require("../../services/secondaryUser.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.deleteSecondaryUser= async function deleteSecondaryUser(event){
    const body = JSON.parse(event.body)
    try {
      console.log("delete SecondaryUser api started")
      const response = await secondaryUserService.deleteSecondaryAccountService(body)
      console.log("delete SecondaryUser api end")
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
