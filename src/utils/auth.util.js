const AWS = require('aws-sdk')
const CognitoIdentity = require('amazon-cognito-identity-js');
const { APPLICATION_CONSTANTS } = require('../constants/application.constants');
module.exports.AuthUtil = class AuthUtil {
  static async adminCreateUser(userDetails) {
    try {
      const { firstName, lastName, mobile, email, customerId, secondaryId } = userDetails

      var cognitoISP = new AWS.CognitoIdentityServiceProvider();
      var params = {
        UserPoolId: 'us-east-1_FoYGRgTyX', /* required */
        Username: email, /* required */
        // DesiredDeliveryMediums: [
        //   SMS | EMAIL,
        //   /* more items */
        // ],
        TemporaryPassword: 'User123@',
        UserAttributes: [
          {
            Name: 'name',
            Value: firstName + " " + lastName
          },
          {
            Name: 'email',
            Value: email
          },
          //   {
          //     Name: 'custom:phone',
          //     Value: mobile
          // },
          {
            Name: 'custom:role',
            Value: 'Primary Account Holder'
          },
          // {
          //   Name: 'phone_number',
          //   Value: "+91" + mobile
          // },
          {
              Name: 'Email verified',
              Value: true
          },
          // {
          //     Name: 'phone_verified',
          //     Value: "false"
          // },
        ],
      };
      await cognitoISP.adminCreateUser(params, function (err, data) {
        console.log(data);
      }).promise();
      return "SUCCESS"
    } catch (error) {
      if (error.code == "UsernameExistsException") {
        throw new Error("User Already Exists");
      }
      else if(error.code == "InvalidSmsRoleAccessPolicyException"){
        console.log("SMS COnfiguration exception")
      }
      console.log(error)
      // throw new Error(error)
    }
  }

  static async getCognitoUser(username) {
    console.log('getCognitoUser ', username)
    const poolData = {
      UserPoolId: 'us-east-1_FoYGRgTyX',
      ClientId: '3egu3j5t1dck447tl9n0d812cf'
    };
    const userPool = new CognitoIdentity.CognitoUserPool(poolData);
    const userData = {
      Username: username,
      Pool: userPool
    };
    console.log('getCognitoUser end')
    return new CognitoIdentity.CognitoUser(userData);
  }

  /**
  * To get Cognito Authentication details
  * @param user
  */
  static getAuthenticationDetails(user) {
    console.log("getAuthenticationDetails util start");
    const authenticationData = {
      Username: user.username,
      Password: user.password,
    };
    const authenticationDetails = new CognitoIdentity.AuthenticationDetails(authenticationData);
    console.log("getAuthenticationDetails util end");
    return authenticationDetails;
  }


  /**
   * enable user in cognito userPool
   * @param username
   */
  static async enableCognitoUser(username) {
    console.log("enableCognitoUser util start");
    const params = {
      UserPoolId: APPLICATION_CONSTANTS["cognitoConfig"]["userPoolId"],
      Username: username,
    };
    const cognitoISP= new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
      cognitoISP.adminEnableUser(params, (error, _response) => {
        if (error) {
          console.error("Cognito adminEnableUser error ", error);
          reject(
            "FAILURE"
          );
        }
        console.error("enableCognitoUser util end");
        resolve("SUCCESS");
      });
    });
  }

  /**
   * disable user in cognito userPool
   * @param  username
   */
  static async disableCognitoUser( username){
    console.log("disableCognitoUser util start");
    const params = {
      UserPoolId:  APPLICATION_CONSTANTS["cognitoConfig"]["userPoolId"],
      Username: username,
    };
    const cognitoISP = new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
      cognitoISP.adminDisableUser(params, (error, _response) => {
        if (error) {
          console.error("Cognito adminDisableUser error. ", error);
          reject(
            "FAILURE"
          );
        }
        console.log("disableCognitoUser util end");
        resolve("SUCCESS");
      });
    });
  }

  /**
   * delete user from userpool
   * @param username
   */
  static async deleteUser(username) {
    console.log("In cognito utility: delete user in cognito ");
    const params = {
      UserPoolId: APPLICATION_CONSTANTS["cognitoConfig"]["userPoolId"],
      Username: username,
    };
    const cognitoISP = new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
      cognitoISP.adminDeleteUser(params, (err) => {
        if (err) {
          console.error("error in deleting cognito user ", err);
          reject("ERROR");
        } else {
          console.log("deleted user in cognito");
          resolve("SUCCESS");
        }
      });
    });
  }

  /**
   * add user to group
   * @param {username, groupName }
   */
  static async addToGroup(username, groupName){
    console.log("addToGroup Auth util start");
    const params = {
      UserPoolId: APPLICATION_CONSTANTS["cognitoConfig"]["userPoolId"],
      Username: username,
      GroupName: groupName,
    };
    const cognitoISP= new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
      cognitoISP.adminAddUserToGroup(params, (error, _response) => {
        if (error) {
          console.error("addToGroup Auth util error");
          reject("ERROR")
        }
        console.log("addToGroup Auth util end");
        resolve("SUCCESS");
      });
    });
  }

  /**
   * remove user from group
   * @param  {username, groupName }
   */
  static async removeFromGroup(username, groupName) {
    console.log("removeFromGroup Auth util start");
    const params = {
      UserPoolId: APPLICATION_CONSTANTS["cognitoConfig"]["userPoolId"],
      Username: username,
      GroupName: groupName,
    };
    const cognitoService = new AWS.CognitoIdentityServiceProvider();
    return new Promise((resolve, reject) => {
      cognitoService.adminRemoveUserFromGroup(params, (error, _response) => {
        if (error) {
          console.error("removeFromGroup Auth util error");
          reject("ERROR")
        }
        console.log("removeFromGroup Auth util end");
        resolve("SUCCESS");
      });
    });
  }

}

