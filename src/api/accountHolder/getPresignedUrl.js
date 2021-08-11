const { AccountHolderService } = require("../../services/accountHolder.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.getKycUrl = async function getKycUrl (event){
    try {
      console.log("getKycUrl  api started")
      const requestParams = event["queryStringParameters"];
      const response = await AccountHolderService.generateKycUrl(requestParams)
      console.log("getKycUrl api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('getKycUrl error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}

