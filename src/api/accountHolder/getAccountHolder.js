const { DEFAULT_HEADERS } = require("../../constants/application.constants");
const { AccountHolderService } = require("../../services/accountHolder.service");
module.exports.getAccountHolder = async function getAccountHolder (event){
    try {
      console.log("getAccountHolder  api started")
      const requestParams = event["queryStringParameters"];
      const response = await AccountHolderService.getAccountHolder(requestParams)
      console.log("getAccountHolder api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('getAccountHolder error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}

