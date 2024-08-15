import AWS from "./aws.config.js";

// Create the DynamoDB service object
const dynamoDBClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default dynamoDBClient;
