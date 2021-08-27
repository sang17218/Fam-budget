const { AuthUtil } = require("../utils/auth.util")
const { AccountHolder } = require("../../models/accountHolder.model")
const { DatabaseUtil } = require("../utils/database.util")
const CognitoIdentity = require('amazon-cognito-identity-js')
const { uploadKycToS3 } = require("../utils/s3.util")
const {Account} = require("../../models/account.model")
const { SecondaryAccountHolder } = require("../../models/secondaryHolder.model")


module.exports.AuthService = class AuthService {
    // static async signUpUser(userDetails) {
    //     let cognitoSuccess = false
    //     try {
    //         // console.log('user details ', userDetails)
    //         await DatabaseUtil.getDbConnection()
    //         //  const {firstName, lastName, mobile, email, gender, city, title, panCard } = userDetails
    //         await AccountHolder.create(userDetails).then( (data) => userDetails["username"] = data["customerId"])

    //         await AuthUtil.adminCreateUser(userDetails)
    //         await AuthUtil.disableCognitoUser(userDetails.username)
    //         cognitoSuccess = true

    //         await uploadKycToS3(userDetails)
    //         return "SUCCESS"

    //     } catch (error) {
    //         console.error(error)
    //         throw new Error(error)
    //     }
    // }

    static async loginUser(userDetails) {
        try {
            console.log('login user service started')
            // Amazon Cognito creates a session which includes the id, access, and refresh tokens of an authenticated user.
            const authenticationData = {
                Username: userDetails["username"],
                Password: userDetails["password"],
            };
            const authenticationDetails = new CognitoIdentity.AuthenticationDetails(authenticationData);
            const cognitoUser = await AuthUtil.getCognitoUser(userDetails["username"])

            function base64Decode(input) {
                const bufferObj = Buffer.from(input, "base64");
                const decodedString = bufferObj.toString("utf8");
                return decodedString;
            }

            return new Promise( (resolve, reject) => {
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: async function (result) {
                        
                        let accountNo
                        const accessToken = result.getAccessToken().getJwtToken().split('.')[1];
                        let group = JSON.parse(base64Decode(accessToken))['cognito:groups'].toString();
                        console.log(group)
                        await DatabaseUtil.getDbConnection()

                        if(group === 'primary-account-holder'){
                            accountNo = await Account.findOne({
                                where : { customerId: userDetails["username"]} ,
                                attributes: ['accountNumber']
                            })
                        }
                        else{
                            accountNo = await SecondaryAccountHolder.findOne({
                                where : { secondaryId: userDetails["username"]} ,
                                attributes: ['secondaryUserAccountNumber']                              
                            })
                        }
                        // console.log("response from db", accountNo)
                        resolve({ success: true,
                            accountNumber: accountNo.accountNumber,
                            accessToken: accessToken ,
                            idToken: result.getIdToken().getJwtToken(),
                             })
                    },
                    onFailure: function (err) {
                        reject(err)
                    },
                    newPasswordRequired: function () {
                        console.log("reset temporary pass required")
                        resolve("PASSWORD_RESET_REQUIRED")
                    }
                });
            }) 
        } catch (error) {
            console.error(error)
            if (["Incorrect username or password.", "Attempt limit exceeded, please try after some time.", "Password attempts exceeded", "User is disabled."].includes(error.message) ) {
                throw new Error(error.message);
            } else{
                throw new Error("FAILURE")
            }
        }
    }

    /**
     * To handle forgot password
     * @param user
     */
    static async forgotPassword(user) {
        try {
            console.log("ForgotPassword Service Start");

            const cognitoUser = await AuthUtil.getCognitoUser(user.username);
            return new Promise(async (resolve, reject) => {
                cognitoUser.forgotPassword({
                    onSuccess: function (_data) {
                        console.log("ForgotPassword API success - Response ");
                        resolve("SUCCESS");
                    },
                    onFailure: function (err) {
                        reject(err);
                    },
                });
            })
        } catch (error) {
            console.log(error)
             if(error.message == "Attempt limit exceeded, please try after some time."){
                throw new Error(error.message)
             }
            throw new Error("FAILURE");
        }
    }

    /**
     * To change new password
     * @param user
     */
    static async confirmPassword(user) {
        try {
            console.log("ConfirmPassword Service Start");
            const cognitoUser = await AuthUtil.getCognitoUser(user.username);
            const verificationCode = user.code;
            const newPassword = user.newPassword;
            return new Promise((resolve, reject) => {
                cognitoUser.confirmPassword(verificationCode, newPassword, {
                    onSuccess() {
                        console.log("ConfirmPassword API success ");
                        resolve({
                            message: "SUCCESS",
                        });
                    },
                    onFailure(err) {
                        reject(err);
                    },
                });
            })
        } catch (error) {
            console.error(error);
            throw new Error("FAILURE");
        }
    }

    /**
     * to reset temporary password upon first login
     * @param user
     */
    static async resetTemporaryPassword(user) {
        try {
            console.log("resetTemporaryPassword service start ");
            const authenticationDetails = AuthUtil.getAuthenticationDetails(user);
            const cognitoUser = await AuthUtil.getCognitoUser(user.username);

            return new Promise((resolve, reject) => {
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: function () {
                        reject("User already changed temporary password");
                    },
                    onFailure: function (err) {
                        console.log("error in reset password temporary ", err);
                        if(["Incorrect username or password.", "User is disabled."].includes(err.message)){
                            reject(err.message)
                        } else {
                            reject("FAILURE")
                        }
                    },
                    newPasswordRequired: function (userAttributes, _requiredAttributes) {
                        console.log("inside newPasswordRequired Challenge");
                        // delete userAttributes.email_verified;
                        // delete userAttributes.email;
                        // delete userAttributes.name

                        // console.log(userAttributes)
                        cognitoUser.completeNewPasswordChallenge(
                            user.newPassword,
                            // userAttributes,
                            {},
                            {
                                onSuccess: function (result) {
                                    console.log("Temporary Password Reset Success");
                                    resolve("SUCCESS");
                                },
                                onFailure: function (err) {
                                    console.error(err);
                                    if (err.code == "InvalidPasswordException") {
                                        reject("InvalidPasswordException");
                                    }
                                    reject("FAILURE");
                                },
                            }
                        );
                    },
                });
            })
        } catch (error) {
            console.log("Error occourred in resetTemporaryPassword %o", error);
            throw new Error(error);
        }
    }
    static async base64Decode(input) {
        const bufferObj = Buffer.from(input, "base64");
        const decodedString = bufferObj.toString("utf8");
        return decodedString;
    }

}
module.exports.base64Decode = function base64Decode(input) {
    const bufferObj = Buffer.from(input, "base64");
    const decodedString = bufferObj.toString("utf8");
    return decodedString;
}