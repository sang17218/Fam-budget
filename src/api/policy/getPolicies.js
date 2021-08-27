const { PolicyService } = require("../../services/policy.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.getPolicy = async function getPolicy(event){
    try {
      console.log("getPolicy api started")
      const requestParams = event["queryStringParameters"];
      const response = await PolicyService.getPolicies(requestParams)
      console.log("getPolicy api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers:DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('getPolicy error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers:DEFAULT_HEADERS
      }
    }
}

