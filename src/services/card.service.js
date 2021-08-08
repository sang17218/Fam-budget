const { DatabaseUtil } = require("../utils/database.util")
const {Account} = require("../../models/account.model")
const {Card} = require("../../models/card.model")
const random = require('random-number')
const randGenerator = random.generator({
    min: 1111111111111111,
    max: 9999999999999999,
    integer: true
})
const cvvGenerator = random.generator({
    min: 100,
    max: 999,
    integer: true
})
module.exports.CardService = class CardService{
    static async createCard(accountDetails) {
        try {
            console.log('createCard service ', accountDetails)
            let response = {}
            // const { accountHolder, ...account} = {...accountDetails };
            const expirationDate = new Date()
            expirationDate.setFullYear( expirationDate.getFullYear() + 3)
            accountDetails["cvv"] = cvvGenerator()
            // accountDetails["cardNumber"] = randGenerator()
            accountDetails["expiryPeriod"] = expirationDate
            accountDetails["type"] = accountDetails.type

            await DatabaseUtil.getDbConnection()
            if(accountDetails["customerId"] && !accountDetails["senderSecondary"]){
                const checkPrimaryUser = await Account.findOne({
                    where: { customerId:  accountDetails["customerId"] }
                })
                if(checkPrimaryUser){
                    response = await Card.create(accountDetails)
                }else{
                    throw new Error("User details mismatch")
                }
            }
            else if(accountDetails["senderSecondary"]){
                response = await Card.create(accountDetails)
            }
            console.log(response)
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }

    static async getCards(accountDetails) {
        try {
            console.log('getCards service ', accountDetails)
            let response = {}
            // const { accountHolder, ...account} = {...accountDetails };

            await DatabaseUtil.getDbConnection()
            if(accountDetails["customerId"] && !accountDetails["senderSecondary"]){
                const checkPrimaryUser = await Account.findOne({
                    where: { customerId:  accountDetails["customerId"] },
                    attributes: ['cardNumber', 'type', 'cvv', 'expiryPeriod']
                })
                if(checkPrimaryUser){
                    response = await Card.findAll({
                        where: {accountNumber: accountDetails["accountNumber"] },
                        attributes: ['cardNumber', 'type', 'cvv', 'expiryPeriod']
                    })
                }else{
                    throw new Error("User details mismatch")
                }
            }
            else if(accountDetails["senderSecondary"]){
                response = await Card.findAll({
                    where: {secondaryId: accountDetails["secondaryId"] }
                })
            }
            console.log(response)
            return response
        } catch (error) {
            console.error('getCards error', error)
            throw new Error("FAILURE")
        }
    }
}
