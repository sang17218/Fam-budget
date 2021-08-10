const { ExpenseTrackingService } = require("../../services/expenseTracking.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.getBalance = async function getBalance(event){
    const body = JSON.parse(event.body)
    try {
      console.log("getBalance api started")
      const response = await ExpenseTrackingService.getBalance(event);
      console.log("getBalance api end")
      return {
        statusCode: 200,
        body: JSON.stringify(response),
        headers: DEFAULT_HEADERS
      }
    } catch (error) {
      console.error(error)
      return {
        statusCode: 500,
        body: JSON.stringify(error),
        headers: DEFAULT_HEADERS
      }
    }
}
