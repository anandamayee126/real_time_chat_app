const AWS = require('aws-sdk')
require('dotenv').config()

function uploadToS3(data,fileName)
{
    const BUCKET_NAME = "expensetrackerandy123";
    const IAM_USER_KEY = process.env.AWS_ANDY_ACCESS_KEY;
    const IAM_USER_SECRET = process.env.AWS_ANDY_SECRET_ACCESS_KEY;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params={
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params,(err,s3Response)=>{
            if(err){
                console.log("Something is Wrong",err);
                reject(err);
            }
            else{
                console.log("Success",s3Response);
                resolve(s3Response);
            }
        })

    })
}

module.exports={uploadToS3};