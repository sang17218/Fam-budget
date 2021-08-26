const {AccountHolderService} = require("../../services/accountHolder.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.primarySignUp = async function primarySignUp(event){
    const body = JSON.parse(event.body)
    try {
      console.log("primarySignUp api started")
      const response = await AccountHolderService.createPrimaryAccountHolder(body)
      console.log("primarySignUp api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('primarySignUp error ',error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}

