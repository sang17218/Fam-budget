const { TransactionService } = require("../../services/Transaction.service")

module.exports.getTransaction = async function getTransaction(event){
    //const requestParams = event["queryStringParameters"];
    try {
        console.log("get Transaction started")
        const response = await TransactionService.getTransactionService(event)
        console.log("get Transaction ended")
        return {
          statusCode: 200,
          body: JSON.stringify(response)
        }
      } catch (error) {
        console.error(error)
        return {
          statusCode: 500,
          body: JSON.stringify(error.message)
        }
      }
}
