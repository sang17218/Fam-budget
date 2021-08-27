const { AuthService } = require("../../services/auth.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.login = async function login(event){
    const body = JSON.parse(event.body)
    try {
      console.log("login api started")
      const response = await AuthService.loginUser(body)
      console.log("login api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('login error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}

