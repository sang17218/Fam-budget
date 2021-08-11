const { AuthService } = require("../../services/auth.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.confirmPassword = async function confirmPassword(event){
    const body = JSON.parse(event.body)
    try {
      console.log("confirmPassword api started")
      const response = await AuthService.confirmPassword(body)
      console.log("confirmPassword api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('confirmPassword error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}
