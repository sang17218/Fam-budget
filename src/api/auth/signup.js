const { AuthService } = require("../../services/auth.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.signUp = async function signUp(event){
    const body = JSON.parse(event.body)
    try {
      console.log("sign up api started")
      const response = await AuthService.signUpUser(body)
      console.log("sign up api end")
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

