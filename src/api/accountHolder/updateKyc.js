const { AccountHolderService} = require("../../services/accountHolder.service")

module.exports.updateKyc = async function updateKyc(event){
    const body = JSON.parse(event.body)
    try {
      console.log("sign up api started")
      const response = await  AccountHolderService.modifyKycStatus(body)
      console.log("sign up api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }
}

