const { AccountHolderService} = require("../../services/accountHolder.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");
module.exports.updateKyc = async function updateKyc(event){
    const body = JSON.parse(event.body)
    try {
      console.log("modifyKycStatus api started")
      const response = await  AccountHolderService.modifyKycStatus(body)
      console.log("modifyKycStatus  api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error('error inmodifyKycStatus', error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}

