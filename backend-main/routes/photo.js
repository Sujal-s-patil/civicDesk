import express from "express";
import photoController from "../controllers/photo.js";

const photoRouter = express.Router();

photoRouter.post("/upload", photoController.upload.single("photo"), photoController.uploadSingleFile);
photoRouter.post("/upload-multiple", photoController.upload.array("files", 10), photoController.uploadMultipleFiles);
photoRouter.get("/:id", photoController.getFilesById);

export default photoRouter;