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
            console.log('createCard service ')
            let response = {}
            // const { accountHolder, ...account} = {...accountDetails };
            const expirationDate = new Date()
            expirationDate.setFullYear( expirationDate.getFullYear() + 3)
            accountDetails["cvv"] = cvvGenerator()
            accountDetails["cardNumber"] = String(randGenerator())
            accountDetails["expiryPeriod"] = expirationDate
            accountDetails["type"] = accountDetails.type

            await DatabaseUtil.getDbConnection()
            response = await Card.create(accountDetails)
            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }
    static async setPin(accountDetails) {
        try {
            console.log('createCard service ')
            let response = {}
            // const { accountHolder, ...account} = {...accountDetails };
            const expirationDate = new Date()
            const pin = accountDetails["pin"];
            const cardNumber = accountDetails["cardNumber"];
            const accountNumber = accountDetails["accountNumber"]
            await DatabaseUtil.getDbConnection()
            if(pin && cardNumber){
                await Card.update({
                    pin:pin
                },{
                    where:{
                        accountNumber:accountNumber,
                        cardNumber:cardNumber
                    }
                })
            }
            else{
                throw new Error("Required Params Failed");
            }

            return "SUCCESS"
        } catch (error) {
            console.error(error)
            throw new Error("FAILURE")
        }
    }

    static async getCards(accountDetails) {
        try {
            console.log('getCards service ')
            let response = {}
            // const { accountHolder, ...account} = {...accountDetails };

            await DatabaseUtil.getDbConnection()

            response = await Card.findAll({
                        where: {accountNumber: accountDetails["accountNumber"] },
                        attributes: ['cardNumber', 'type', 'cvv', 'expiryPeriod', 'accountNumber']
            })
                
            return response
        } catch (error) {
            console.error('getCards error', error)
            throw new Error("FAILURE")
        }
    }
}
