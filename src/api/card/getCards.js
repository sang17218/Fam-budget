const { CardService } = require("../../services/card.service")

module.exports.getCards = async function getCards(event){
    const body = JSON.parse(event.body)
    try {
      console.log("getCards api started")
      const response = await CardService.createCard(body)
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

