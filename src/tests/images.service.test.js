import { uploadImage, getImageById } from "../services/images.service";
import { getPreSignedUrl, uploadImageToS3 } from "../services/s3.service";
import { getImageMetadataFromDynamoDB, saveImageMetadataToDynamoDB } from "../services/dynamodb.service";
import { deleteFileLocally } from "../services/files.service";
import { v4 as uuidv4 } from "uuid";

jest.mock("../services/s3.service");
jest.mock("../services/dynamodb.service");
jest.mock("../services/files.service");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("Image Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadImage", () => {
    it("should upload an image, save metadata, and return the image URL", async () => {
      const mockFile = {
        originalname: "test-image.jpg",
        path: "/path/to/test-image.jpg",
      };
      const mockOwner = "user123";
      const mockImageId = "mock-uuid";
      const mockExt = "jpg";

      uuidv4.mockReturnValue(mockImageId);
      uploadImageToS3.mockResolvedValue();
      saveImageMetadataToDynamoDB.mockResolvedValue({ id: mockImageId, ext: mockExt });
      getPreSignedUrl.mockResolvedValue(`https://mock-s3-url/${mockImageId}.${mockExt}`);

      const result = await uploadImage(mockFile, mockOwner);

      expect(uploadImageToS3).toHaveBeenCalledWith(mockFile, mockImageId);
      expect(saveImageMetadataToDynamoDB).toHaveBeenCalledWith(mockImageId, {
        filename: mockFile.originalname,
        owner: mockOwner,
      });
      expect(getPreSignedUrl).toHaveBeenCalledWith(`${mockImageId}.${mockExt}`);
      expect(deleteFileLocally).toHaveBeenCalledWith(mockFile.path);

      expect(result).toEqual({
        id: mockImageId,
        ext: mockExt,
        imageUrl: `https://mock-s3-url/${mockImageId}.${mockExt}`,
      });
    });
  });

  describe("getImageById", () => {
    it("should return the image metadata and URL if image is found", async () => {
      const mockImageId = "mock-uuid";
      const mockExt = "jpg";
      const mockQuality = "high";
      const mockMetadata = {
        id: mockImageId,
        filename: "test-image.jpg",
        owner: "user123",
        ext: mockExt,
      };

      getImageMetadataFromDynamoDB.mockResolvedValue(mockMetadata);
      getPreSignedUrl.mockResolvedValue(`https://mock-s3-url/${mockQuality}/${mockImageId}.${mockExt}`);

      const result = await getImageById(mockImageId, mockQuality);

      expect(getImageMetadataFromDynamoDB).toHaveBeenCalledWith(mockImageId);
      expect(getPreSignedUrl).toHaveBeenCalledWith(`${mockQuality}/${mockImageId}.${mockExt}`);

      expect(result).toEqual({
        imageUrl: `https://mock-s3-url/${mockQuality}/${mockImageId}.${mockExt}`,
        filename: mockMetadata.filename,
        owner: mockMetadata.owner,
        id: mockImageId,
        ext: mockExt,
      });
    });

    it("should throw an error if image is not found", async () => {
      const mockImageId = "non-existent-id";

      getImageMetadataFromDynamoDB.mockResolvedValue(null);

      await expect(getImageById(mockImageId)).rejects.toThrow("Image not found");
      expect(getImageMetadataFromDynamoDB).toHaveBeenCalledWith(mockImageId);
      expect(getPreSignedUrl).not.toHaveBeenCalled();
    });
  });
});
