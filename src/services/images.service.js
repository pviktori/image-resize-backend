import { getPreSignedUrl, uploadImageToS3 } from "./s3.service.js";
import { getImageMetadataFromDynamoDB, saveImageMetadataToDynamoDB } from "./dynamodb.service.js";
import { v4 as uuidv4 } from "uuid";
import { deleteFileLocally } from "./files.service.js";

export const uploadImage = async (file, owner) => {
  const imageId = uuidv4();

  await uploadImageToS3(file, imageId);

  const result = await saveImageMetadataToDynamoDB(imageId, { filename: file.originalname, owner });
  const imageUrl = await getPreSignedUrl(imageId + "." + result.ext);

  deleteFileLocally(file.path);

  return { ...result, imageUrl };
};

export const getImageById = async (imageId, quality) => {
  const imagePath = quality ? quality + "/" + imageId : imageId;
  const imageMetadata = await getImageMetadataFromDynamoDB(imageId);

  if (!imageMetadata) {
    throw new Error("Image not found");
  }

  const imageUrl = await getPreSignedUrl(imagePath + "." + imageMetadata.ext);

  return {
    imageUrl,
    filename: imageMetadata.filename,
    owner: imageMetadata.owner,
    id: imageMetadata.id,
    ext: imageMetadata.ext,
  };
};
