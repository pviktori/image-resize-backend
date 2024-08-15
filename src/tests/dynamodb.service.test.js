import dynamoDBClient from "../core/dynamodb.config.js";
import { saveImageMetadataToDynamoDB, getImageMetadataFromDynamoDB } from "../services/dynamodb.service";

jest.mock("../core/dynamodb.config.js");

const TABLE_NAME = process.env.AWS_DYNAMODB_TABLE_NAME;

describe("DynamoDB Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveImageMetadataToDynamoDB", () => {
    it("should save image metadata to DynamoDB and return the saved item", async () => {
      const mockImageId = "mock-uuid";
      const mockFilename = "test-image.jpg";
      const mockOwner = "user123";
      const mockParams = {
        TableName: TABLE_NAME,
        Item: {
          id: mockImageId,
          filename: mockFilename,
          ext: "jpg",
          owner: mockOwner,
        },
      };

      dynamoDBClient.put.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      const result = await saveImageMetadataToDynamoDB(mockImageId, {
        filename: mockFilename,
        owner: mockOwner,
      });

      expect(dynamoDBClient.put).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockParams.Item);
    });

    it("should throw an error if saving metadata fails", async () => {
      const mockImageId = "mock-uuid";
      const mockFilename = "test-image.jpg";
      const mockOwner = "user123";

      dynamoDBClient.put.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      await expect(
        saveImageMetadataToDynamoDB(mockImageId, {
          filename: mockFilename,
          owner: mockOwner,
        })
      ).rejects.toThrow("Saving metadata failed");

      expect(dynamoDBClient.put).toHaveBeenCalled();
    });
  });

  describe("getImageMetadataFromDynamoDB", () => {
    it("should retrieve image metadata from DynamoDB", async () => {
      const mockImageId = "mock-uuid";
      const mockItem = {
        id: mockImageId,
        filename: "test-image.jpg",
        ext: "jpg",
        owner: "user123",
      };
      const mockParams = {
        TableName: TABLE_NAME,
        Key: { id: mockImageId },
      };

      dynamoDBClient.get.mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Item: mockItem }),
      });

      const result = await getImageMetadataFromDynamoDB(mockImageId);

      expect(dynamoDBClient.get).toHaveBeenCalledWith(mockParams);
      expect(result).toEqual(mockItem);
    });

    it("should throw an error if retrieving metadata fails", async () => {
      const mockImageId = "mock-uuid";

      dynamoDBClient.get.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error("DynamoDB error")),
      });

      await expect(getImageMetadataFromDynamoDB(mockImageId)).rejects.toThrow("Retrieving metadata failed");

      expect(dynamoDBClient.get).toHaveBeenCalled();
    });
  });
});
