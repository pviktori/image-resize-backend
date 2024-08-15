import s3Client from '../core/s3.config';
import { getFileBuffer } from '../services/files.service';
import { uploadImageToS3, getPreSignedUrl } from '../services/s3.service';

jest.mock('../core/s3.config');
jest.mock('../services/files.service');

describe('S3 Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImageToS3', () => {
    it('should upload an image to S3 successfully', async () => {
      const mockFile = {
        path: '/path/to/file.jpg',
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
      };
      const mockImageId = 'mock-uuid';
      const mockBuffer = Buffer.from('file content');
      const ext = 'jpg';
      const mockParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${mockImageId}.${ext}`,
        Body: mockBuffer,
        ContentType: mockFile.mimetype,
      };

      getFileBuffer.mockReturnValue(mockBuffer);
      s3Client.upload.mockReturnValue({
        promise: jest.fn().mockResolvedValue({}),
      });

      await uploadImageToS3(mockFile, mockImageId);

      expect(getFileBuffer).toHaveBeenCalledWith(mockFile.path);
      expect(s3Client.upload).toHaveBeenCalledWith(mockParams);
    });

    it('should throw an error if image upload fails', async () => {
      const mockFile = {
        path: '/path/to/file.jpg',
        originalname: 'test-image.jpg',
        mimetype: 'image/jpeg',
      };
      const mockImageId = 'mock-uuid';
      const mockBuffer = Buffer.from('file content');
      const ext = 'jpg';
      const mockParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${mockImageId}.${ext}`,
        Body: mockBuffer,
        ContentType: mockFile.mimetype,
      };
      const mockError = new Error('S3 upload failed');

      getFileBuffer.mockReturnValue(mockBuffer);
      s3Client.upload.mockReturnValue({
        promise: jest.fn().mockRejectedValue(mockError),
      });

      await expect(uploadImageToS3(mockFile, mockImageId)).rejects.toThrow('Image upload failed');

      expect(getFileBuffer).toHaveBeenCalledWith(mockFile.path);
      expect(s3Client.upload).toHaveBeenCalledWith(mockParams);
    });
  });

  describe('getPreSignedUrl', () => {
    it('should return a pre-signed URL for the given image ID', async () => {
      const mockImageId = 'mock-uuid';
      const mockUrl = 'https://mock-s3-url/mock-uuid';
      const mockParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: mockImageId,
        Expires: 3600,
        ResponseContentType: 'image/jpeg',
      };

      s3Client.getSignedUrlPromise.mockResolvedValue(mockUrl);

      const result = await getPreSignedUrl(mockImageId);

      expect(s3Client.getSignedUrlPromise).toHaveBeenCalledWith('getObject', mockParams);
      expect(result).toBe(mockUrl);
    });

    it('should throw an error if generating the pre-signed URL fails', async () => {
      const mockImageId = 'mock-uuid';
      const mockError = new Error('S3 URL generation failed');
      const mockParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: mockImageId,
        Expires: 3600,
        ResponseContentType: 'image/jpeg',
      };

      s3Client.getSignedUrlPromise.mockRejectedValue(mockError);

      await expect(getPreSignedUrl(mockImageId)).rejects.toThrow('S3 URL generation failed');

      expect(s3Client.getSignedUrlPromise).toHaveBeenCalledWith('getObject', mockParams);
    });
  });
});
