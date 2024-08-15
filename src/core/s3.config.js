import AWS from "./aws.config.js";

// Create S3 service object
const s3Client = new AWS.S3({
  apiVersion: "2006-03-01",
  signatureVersion: "v4",
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3Client;
