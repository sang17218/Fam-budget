const { ExpenseTrackingService } = require("../../services/expenseTracking.service")

module.exports.expenseTracking= async function expenseTracking(event){
    const body = JSON.parse(event.body)
    try {
      console.log("expense tracking api started")
      const response = await ExpenseTrackingService.getMonthlyOverview(event);
      console.log("expense tracking api end")
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
