const { CardService } = require("../../services/card.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.getCards = async function getCards(event){
    try {
      console.log("getCards api started")
      const requestParams = event["queryStringParameters"]
      const response = await CardService.getCards(requestParams)
      console.log("getCards  api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers:DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('getCards error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers:DEFAULT_HEADERS
      }
    }
}

