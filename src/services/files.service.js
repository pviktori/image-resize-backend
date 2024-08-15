import fs from "fs";

export const streamFile = async (filePath) => {
  try {
    let fileStream = await fs.createReadStream(filePath);
    return fileStream;
  } catch (error) {
    console.log("Streaming file error", error);

    throw error;
  }
};

export const getFileBuffer = (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return buffer;
  } catch (error) {
    console.log("Streaming file error", error);

    throw error;
  }
};

export const deleteFileLocally = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log("Deleting error", error);
    throw error;
  }
};
