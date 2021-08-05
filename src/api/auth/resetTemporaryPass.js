const { AuthService } = require("../../services/auth.service")

module.exports.resetTemporaryPassword = async function resetTemporaryPassword (event){
    const body = JSON.parse(event.body)
    try {
      console.log("resetTemporaryPassword  api started")
      const response = await AuthService.resetTemporaryPassword(body)
      console.log("resetTemporaryPassword  api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error('resetTemporaryPassword  error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}
