const { CardService } = require("../../services/card.service")

module.exports.getCards = async function getCards(event){
    try {
      console.log("getCards api started")
      const requestParams = event["queryStringParameters"]
      const response = await CardService.getCards(requestParams)
      console.log("getCards  api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error('getCards error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}

