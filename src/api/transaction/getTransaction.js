const { DEFAULT_HEADERS } = require("../../constants/application.constants");
const { TransactionService } = require("../../services/Transaction.service")

module.exports.getTransaction = async function getTransaction(event){
    //const requestParams = event["queryStringParameters"];
    try {
        console.log("get Transaction started")
        const requestParams = event["queryStringParameters"];
        const response = await TransactionService.getTransactionService(requestParams)
        console.log("get Transaction ended")

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
