const { PolicyService } = require("../../services/policy.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.createPolicy = async function createPolicy(event){
    const body = JSON.parse(event.body)
    try {
      console.log("createPolicy api started")
      const response = await PolicyService.createPolicy(body)
      console.log("createPolicy api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers:DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('createPolicy error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers:DEFAULT_HEADERS
      }
    }
}

