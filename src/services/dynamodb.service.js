import dynamoDBClient from "../core/dynamodb.config.js";

const TABLE_NAME = process.env.AWS_DYNAMODB_TABLE_NAME;

export const saveImageMetadataToDynamoDB = async (imageId, { filename, owner }) => {
  const originalNameSplitted = filename.split(".");
  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: imageId,
      filename,
      ext: originalNameSplitted[originalNameSplitted.length - 1],
      owner,
    },
  };

  try {
    await dynamoDBClient.put(params).promise();
    return params.Item;
  } catch (error) {
    console.error("Error saving image metadata to DynamoDB:", error);
    throw new Error("Saving metadata failed");
  }
};

export const getImageMetadataFromDynamoDB = async (imageId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: imageId,
    },
  };

  try {
    const result = await dynamoDBClient.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error("Error retrieving image metadata from DynamoDB:", error);
    throw new Error("Retrieving metadata failed");
  }
};
