import express from "express";
import imageController from "../controllers/imageController.js";

const imageRouter = express.Router();

// Returns all the image formats supported
imageRouter.get("/format", imageController.listSupportedFormats);

// Handles image formatting
imageRouter.post("/format", imageController.changeImageFormat);

// Handles image resizing
imageRouter.post("/resize", imageController.changeImageHeightWidth);

export default imageRouter;
