import s3Client from "../core/s3.config.js";
import { getFileBuffer } from "./files.service.js";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

export const uploadImageToS3 = async (file, imageId) => {
  const buffer = getFileBuffer(file.path);
  const extArray = file.originalname.split(".");
  const params = {
    Bucket: BUCKET_NAME,
    Key: imageId + "." + extArray[extArray.length - 1],
    Body: buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.upload(params).promise();
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw new Error("Image upload failed");
  }
};

export const getPreSignedUrl = async (imageId) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: imageId,
    Expires: 60 * 60, // URL expires in 1 hour
    ResponseContentType: "image/jpeg", // Adjust based on your file type
  };
  const res = await s3Client.getSignedUrlPromise("getObject", params);

  return res;
};
