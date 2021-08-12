const { DatabaseUtil } = require("../utils/database.util")
const {Account} = require("../../models/account.model")
const uuid = require("uuid").v4
const random = require('random-number')
const { Policy } = require("../../models/policy.model")
const randGenerator = random.generator({
    min: 1111111111,
    max: 9999999999,
    integer: true
})
module.exports.PolicyService = class PolicyService {
    static async createPolicy(details) {
        try {
            console.log('createPolicy details ', details)
            details["policyId"] = uuid().slice(0,15)
            await DatabaseUtil.getDbConnection()
            await Policy.create(details)
            return "SUCCESS"
        } catch (error) {
            console.error('createPolicy error ', error)
            throw new Error("FAILURE")
        }
    }

    static async getPolicies(details) {
        try {
            console.log('getPolicies service ', details)
            let response = {}
            await DatabaseUtil.getDbConnection()
            const checkPrimaryUser = await Account.findOne({
                where: { customerId:  details["customerId"], accountNumber: details["accountNumber"]},
            })
            if(checkPrimaryUser){
                const users = await Policy.findAll({
                    where: { accountNumber: details["accountNumber"]}
                }) || []
                for(let elt of users){
                    if(elt["isSecondaryHolder"]){
                        response[`${elt.secondaryId}`] = elt
                    }
                }
            }else{
                throw new Error("User details mismatch")
            }
           return response
        } catch (error) {
            console.error('getPolicies error', error)
            throw new Error("FAILURE")
        }
    }

    static async updatePolicies(details){
        try {
            console.log('updatePolicies service ', details)
            const updateValues = {...details, policyId, accountNumber, customerId}
            console.log(updateValues)
            await DatabaseUtil.getDbConnection()
            const checkPrimaryUser = await Account.findOne({
                where: { customerId:  details["customerId"], accountNumber: details["accountNumber"]},
            })
            if(checkPrimaryUser){
                return await Policy.update({
                    updateValues,
                    where: { policyId: details["policyId"]}
                })
            }else{
                throw new Error("User details mismatch")
            }
        } catch (error) {
            console.error('updatePolicies error', error)
            throw new Error("FAILURE")
        }        
    }
}
