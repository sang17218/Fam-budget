const { PolicyService } = require("../../services/policy.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.updatePolicy = async function updatePolicy(event){
    try {
      console.log("updatePolicy api started")
      const body = JSON.parse(event.body)
      const response = await PolicyService.updatePolicies(body)
      console.log("updatePolicy api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers:DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('updatePolicy error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers:DEFAULT_HEADERS
      }
    }
}

