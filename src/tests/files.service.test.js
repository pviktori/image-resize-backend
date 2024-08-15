import fs from "fs";
import { streamFile, getFileBuffer, deleteFileLocally } from "../services/files.service";

jest.mock("fs");

describe("File Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("streamFile", () => {
    it("should return a file stream", async () => {
      const mockFilePath = "/path/to/file.txt";
      const mockFileStream = {
        on: jest.fn(),
      };

      fs.createReadStream.mockReturnValue(mockFileStream);

      const result = await streamFile(mockFilePath);

      expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath);
      expect(result).toBe(mockFileStream);
    });

    it("should throw an error if file streaming fails", async () => {
      const mockFilePath = "/path/to/file.txt";
      const mockError = new Error("File not found");

      fs.createReadStream.mockImplementation(() => {
        throw mockError;
      });

      await expect(streamFile(mockFilePath)).rejects.toThrow(mockError);

      expect(fs.createReadStream).toHaveBeenCalledWith(mockFilePath);
    });
  });

  describe("getFileBuffer", () => {
    it("should return a file buffer", () => {
      const mockFilePath = "/path/to/file.txt";
      const mockBuffer = Buffer.from("file content");

      fs.readFileSync.mockReturnValue(mockBuffer);

      const result = getFileBuffer(mockFilePath);

      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
      expect(result).toBe(mockBuffer);
    });

    it("should throw an error if reading file buffer fails", () => {
      const mockFilePath = "/path/to/file.txt";
      const mockError = new Error("File not found");

      fs.readFileSync.mockImplementation(() => {
        throw mockError;
      });

      expect(() => getFileBuffer(mockFilePath)).toThrow(mockError);

      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath);
    });
  });

  describe("deleteFileLocally", () => {
    it("should delete a file locally", () => {
      const mockFilePath = "/path/to/file.txt";

      deleteFileLocally(mockFilePath);

      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
    });

    it("should throw an error if file deletion fails", () => {
      const mockFilePath = "/path/to/file.txt";
      const mockError = new Error("File not found");

      fs.unlinkSync.mockImplementation(() => {
        throw mockError;
      });

      expect(() => deleteFileLocally(mockFilePath)).toThrow(mockError);

      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
    });
  });
});
