
//Remote settings-----------------------------------------------------------
var regionName = "ca-central-1"; //Replace with your correct AWS region
var bucketName = "test-yaqi"; //replace with your bucket name
var testFilePath = "IMG_0755.JPG"; //replace with the file path you want to GET
//AWS Credentials
var accessKey = "AKIA25ZIRRWGXLOLP3EJ"; //Replace with your Access Key
var secretKey = "9X8fvFtqyXOI35DrzyncqE/xWEkLBjmKGai2ACg6"; //Replace with your Secret Key

//Settings -----------------------------------------------------------------
var sep = "%2F"; // Used to encode the '/' 
var serviceName = "s3";
var expiration = "300" //The generate url will be valid for 24 hours from the current date;
var baseUrl = "https://"+bucketName+".s3." + regionName + ".amazonaws.com/";

var Crypto = require("crypto-js");

//getSignatureKey function
function getSignatureKey(key, dateStamp, regionName, serviceName) {
    var kDate = Crypto.HmacSHA256(dateStamp, "AWS4" + key);
    var kRegion = Crypto.HmacSHA256(regionName, kDate);
    var kService = Crypto.HmacSHA256(serviceName, kRegion);
    var kSigning = Crypto.HmacSHA256("aws4_request", kService);
    return kSigning;
}

//formated date params
var dateISO = new Date().toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\..+/, '')+'Z' ;    //UTC '20210314T145106Z'
var dateScope = dateISO.substring(0,8); // yyyyMMdd
var expiration = "86400"
var sep = '%2F'

//query params
var queryParameters = "X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=" + accessKey + sep + dateScope + sep + regionName + sep + "s3" + sep+"aws4_request" +
		"&X-Amz-Date="+ dateISO +
		"&X-Amz-Expires="+ expiration +
		"&X-Amz-SignedHeaders=host";

var canonicalRequest = "GET" + "\n" + 
		"/"+testFilePath + "\n" +  
		 queryParameters + "\n" + 
		"host:"+bucketName+".s3." + regionName + ".amazonaws.com" + "\n\n" + 
		"host"+ "\n" + 
		"UNSIGNED-PAYLOAD";

//generate string to sign
var stringToSign = 'AWS4-HMAC-SHA256\n20210314T233326Z\n20210314/ca-central-1/s3/aws4_request\ncf6de7501000f4703f9d78c733fbcac9aaa20cf946ef5b4c6e4cb16ce1ab562a'
var stringToSign = 'AWS4-HMAC-SHA256\n' + dateISO + '\n' + dateScope + '/' + regionName + '/s3/aws4_request\n' + Crypto.SHA256(canonicalRequest)

//generate key to sign
//var signingKey = Crypto.HmacSHA256(Crypto.HmacSHA256(Crypto.HmacSHA256(Crypto.HmacSHA256("AWS4" + secretKey,dateScope),regionName),"s3"),"aws4_request")
var signinigKey = getSignatureKey(secretKey,dateScope,regionName,"s3")

//sign string with key
var signature = Crypto.HmacSHA256(stringToSign, signinigKey)

//generate final url
const authorizedUrl = "https://"+bucketName+".s3." + regionName + ".amazonaws.com/" + testFilePath + "?" + queryParameters + "&X-Amz-Signature=" + signature

//export url to router server
module.exports = authorizedUrl
