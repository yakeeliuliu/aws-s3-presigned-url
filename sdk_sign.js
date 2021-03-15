
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
   endpoint: 's3-ca-central-1.amazonaws.com',   // Put you region
   accessKeyId: '',       // Put you accessKeyId
   secretAccessKey: '',   // Put you accessKeyId
   Bucket: 'test-yaqi',         // Put your bucket name
   signatureVersion: 'v4',
   region: 'ca-central-1'           // Put you region
});



const    Bucket = 'test-yaqi';
const    Key = 'IMG_0755.JPG';
const    Expires = 60 * 5;


var params = {Bucket: Bucket, Key: Key};
var authorizedUrl = s3.getSignedUrl('getObject', params);
module.exports = authorizedUrl
