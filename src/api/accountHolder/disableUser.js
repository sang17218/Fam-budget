const { AccountHolderService } = require("../../services/accountHolder.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.disablePrimaryUser = async function disablePrimaryUser(event){
    try {
      console.log("disablePrimaryUser api started")
      const requestParams = event["queryStringParameters"];
      const response = await AccountHolderService.disablePrimaryAccountHolder(requestParams)
      console.log("disablePrimaryUser api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('disablePrimaryUser error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}

