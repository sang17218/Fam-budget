const { CardService } = require("../../services/card.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.setPin = async function setPin(event){
    const body = JSON.parse(event.body)
    try {
      console.log("setPin api started")
      const response = await CardService.setPin(body)
      console.log("setPin api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers:DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('createCard error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers:DEFAULT_HEADERS
      }
    }
}

