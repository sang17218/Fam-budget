const { AuthService } = require("../../services/auth.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.forgotPassword = async function forgotPassword(event){
    const body = JSON.parse(event.body)
    try {
      console.log("forgotPassword api started")
      const response = await AuthService.forgotPassword(body)
      console.log("forgotPassword api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('forgotPassword error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}
