const { CardService } = require("../../services/card.service")

module.exports.createPolicy = async function createPolicy(event){
    const body = JSON.parse(event.body)
    try {
      console.log("createPolicy api started")
      const response = await CardService.createCard(body)
      console.log("createPolicy api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error('createPolicy error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}

