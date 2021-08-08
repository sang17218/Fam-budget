const { ExpenseTrackingService } = require("../../services/expenseTracking.service")

module.exports.getBalance = async function getBalance(event){
    const body = JSON.parse(event.body)
    try {
      console.log("getBalance api started")
      const response = await ExpenseTrackingService.getBalance(event);
      console.log("getBalance api end")
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
