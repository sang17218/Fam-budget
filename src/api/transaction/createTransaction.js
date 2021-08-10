const { DEFAULT_HEADERS } = require("../../constants/application.constants");
const { TransactionService } = require("../../services/Transaction.service")

module.exports.createTransaction = async function createTransaction(event){

    const body = JSON.parse(event.body)
    try {
      console.log("created Transaction started")
      const response = await TransactionService.createTransactionService(body)
      console.log("created Transaction ended")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error.message),
        headers: DEFAULT_HEADERS
      }
    }

}
