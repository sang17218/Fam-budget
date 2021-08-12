const { secondaryUserService } = require("../../services/secondaryUser.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.addFunds= async function addFunds(event){
    const body = JSON.parse(event.body)
    try {
      console.log("addFunds SecondaryUser api started")
      const response = await secondaryUserService.addFunds(body)
      console.log("addFunds SecondaryUser api end")
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
