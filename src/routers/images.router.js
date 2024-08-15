import multer from "multer";
import { uploadImage, getImageById } from "../services/images.service.js";
import express from "express";

const router = express.Router();

// Define the storage location for the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

// Initialize multer middleware
const upload = multer({ storage });

router.post(`/upload`, upload.single("file"), async (req, res) => {
  try {
    const owner = req.query.owner;
    const result = await uploadImage(req.file, owner);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    const quality = req.query.q;
    const result = await getImageById(imageId, quality);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
