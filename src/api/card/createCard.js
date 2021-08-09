const { CardService } = require("../../services/card.service")

module.exports.createCard = async function createCard(event){
    const body = JSON.parse(event.body)
    try {
      console.log("createCard api started")
      const response = await CardService.createCard(body)
      console.log("createCard api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error('createCard error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}

