const { PolicyService } = require("../../services/policy.service")

module.exports.getPolicy = async function getPolicy(event){
    try {
      console.log("getPolicy api started")
      const requestParams = event["queryStringParameters"];
      const response = await PolicyService.getPolicies(requestParams)
      console.log("getPolicy api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error('getPolicy error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}

