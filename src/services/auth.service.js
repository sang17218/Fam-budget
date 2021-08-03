const { AuthUtil } = require("../utils/auth.util")
const {AccountHolder} = require("../../models/accountHolder.model")
const {DatabaseUtil} = require("../utils/database.util")
module.exports.AuthService = class AuthService{
    static async signUpUser(userDetails){
        try {
            console.log('user details ', userDetails)
            // if(userDetails["panCard"])
             await AuthUtil.adminCreateUser(userDetails)
             await DatabaseUtil.getDbConnection()
            //  const {firstName, lastName, mobile, email, gender, city, title, panCard } = userDetails
            return await AccountHolder.create(userDetails)
            
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}
