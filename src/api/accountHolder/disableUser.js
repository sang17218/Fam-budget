const { AccountHolderService } = require("../../services/accountHolder.service")

module.exports.disablePrimaryUser = async function disablePrimaryUser(event){
    const body = JSON.parse(event.body)
    try {
      console.log("disablePrimaryUser api started")
      const response = await AccountHolderService.disablePrimaryAccountHolder(body)
      console.log("disablePrimaryUser api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error('disablePrimaryUser error', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}

