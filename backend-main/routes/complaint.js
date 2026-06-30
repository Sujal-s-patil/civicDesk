import express from "express";
import validateSchema from "../middlewares/validateSchema.js";
import {
  listComplaints,
  createComplaintHandler,
  getComplaint,
  lastComplaintId,
  setComplaintStatus,
  addComment,
  getComments,
} from "../controllers/complaint.js";
import {
  complaintCreateSchema,
  complaintCommentCreateSchema,
  complaintStatusSchema,
  complaintEvidenceUploadSchema,
} from "../schemas/complaintSchema.js";
import { uploadEvidence } from "../middlewares/upload.js";
import { uploadComplaintEvidence, getEvidenceByComplaintId } from "../controllers/evidence.js";
import { uploadPhoto } from "../middlewares/upload.js";
import { uploadSinglePhoto } from "../controllers/evidence.js";
import { verifyToken, requireRole } from "../middlewares/auth.js";

const complaintRouter = express.Router();

complaintRouter.get("/get", verifyToken, requireRole("police"), listComplaints);
complaintRouter.get("/last", verifyToken, requireRole("citizen", "police"), lastComplaintId);
complaintRouter.get("/:id", verifyToken, requireRole("citizen", "police"), getComplaint);
complaintRouter.post("/create", verifyToken, requireRole("citizen"), validateSchema(complaintCreateSchema), createComplaintHandler);
complaintRouter.put("/status", verifyToken, requireRole("police"), validateSchema(complaintStatusSchema), setComplaintStatus);
complaintRouter.put("/comment", verifyToken, requireRole("police"), validateSchema(complaintCommentCreateSchema), addComment);
complaintRouter.get("/:id/comments", verifyToken, requireRole("police"), getComments);

// Evidence — multer first, Zod second (multer populates req.body for multipart)
complaintRouter.post(
    "/evidence",
    verifyToken,
    requireRole("citizen", "police"),
    uploadEvidence.array("photos", 5),
    validateSchema(complaintEvidenceUploadSchema),
    uploadComplaintEvidence
);
complaintRouter.get("/:id/evidence", verifyToken, requireRole("citizen", "police"), getEvidenceByComplaintId);
complaintRouter.post("/photo", verifyToken, requireRole("citizen", "police"), uploadPhoto.single("photo"), uploadSinglePhoto);

export default complaintRouter;