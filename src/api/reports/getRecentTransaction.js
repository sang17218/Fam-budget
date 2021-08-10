const { ExpenseTrackingService } = require("../../services/expenseTracking.service")
const { DEFAULT_HEADERS } = require("../../constants/application.constants");

module.exports.getRecentTransaction = async function getRecentTransaction(event){
    const body = JSON.parse(event.body)
    try {
      console.log("getRecentTransaction api started")
      const response = await ExpenseTrackingService.getRecentTransaction(event);
      console.log("getRecentTransaction api end")
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
