const AWS = require("aws-sdk")
module.exports.uploadKycToS3 = async function uploadKycToS3(body) {
    try {
        const files = body.files;
        console.log("Uploading Resume to S3 started");
        for (let ind = 0; ind < files.length; ind += 1) {
            const base64Str = files[ind].data
            const buff = Buffer.from(base64Str, 'base64');
            const key = files[ind].fileName;

            const data = await new AWS.S3()
                .upload({
                    Bucket: 'fambudget-bucket',
                    Key: `primary-users/kyc/${body["username"]}/${key}`,
                    Body: buff,
                    ContentType: files[ind].fileType ,
                }).promise().catch( (err) => console.error(err))
                console.log(data)
        }
        console.log("ended");
        //   return uploadedFile;
    } catch (err) {
        console.log("Exception in s3UploadHome %o", err);
        throw err;
    }
}