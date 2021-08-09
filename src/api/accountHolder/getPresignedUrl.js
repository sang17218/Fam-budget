const { AccountHolderService } = require("../../services/accountHolder.service")

module.exports.getKycUrl = async function getKycUrl (event){
    try {
      console.log("getKycUrl  api started")
      const requestParams = event["queryStringParameters"];
      const response = await AccountHolderService.generateKycUrl(requestParams)
      console.log("getKycUrl api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error('getKycUrl error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}

