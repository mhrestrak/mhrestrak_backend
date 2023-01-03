const AWS = require("aws-sdk");
const uniqid = require("uniqid");
const config = require("config");
const S3_BUCKET = "restrak-mhm-bucket";
const REGION = "us-east-2";
const accessKeyId = config.get("AWS_ACCESS_KEY_ID");
const secretAccessKey = config.get("AWS_SECRET_ACCESS_KEY");

AWS.config.update({
  region: REGION,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

const bucket = new AWS.S3();

function getExtension(fileName) {
  let arr = fileName.split(".");
  let extension = arr[arr.length - 1];
  arr.pop();
  let name = arr.join("");
  return { name, extension };
}

function generateObjectUrl(key) {
  return `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

async function generatePreSignedUploadUrl(fileName, fileType) {
  const { name, extension } = getExtension(fileName);
  const random = Math.random() * 10000000;
  const params = {
    Bucket: S3_BUCKET,
    Key: `${name}-${random}.${extension}`,
    ContentType: fileType,
    Expires: 300,
    ACL: "public-read",
  };
  let res = await bucket.getSignedUrlPromise("putObject", params);

  return {
    key: params.Key,
    signedUrl: res,
    downloadUrl: generateObjectUrl(params.Key),
  };
}

async function deleteAwsObject(fileName) {
  const params = {
    Bucket: S3_BUCKET,
    Key: fileName,
  };
  let res = await bucket.deleteObject(params).promise();
  return res;
}

module.exports = {
  generatePreSignedUploadUrl,
  deleteAwsObject,
  generateObjectUrl,
};