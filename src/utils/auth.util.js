const AWS = require('aws-sdk')

module.exports.AuthUtil = class AuthUtil {
  static async adminCreateUser(userDetails) {
    try {
      const { firstName, lastName, mobile, email  } = userDetails

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
          {
            Name: 'phone_number',
            Value: "+91" + mobile
          },
          // {
          //     Name: 'Email verified',
          //     Value: true
          // },
          // {
          //     Name: 'phone_verified',
          //     Value: "false"
          // },
        ],
      };
      await cognitoISP.adminCreateUser(params, function (err, data) {
        // if (err) console.log(err, err.stack); // an error occurred
        console.log(data);           // successful response
      }).promise();
      return "SUCCESS"
    } catch (error) {
      console.log(error)
      // throw new Error(error)
    }
  }
}

