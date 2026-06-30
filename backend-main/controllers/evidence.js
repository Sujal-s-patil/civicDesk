import db from "../db/sql.js";
import { createError } from "../utils/createError.js";

// Single photo upload — used standalone, e.g. citizen/police profile photo.
// Just returns the URL; caller decides where to store it (citizens.photo, etc).
export const uploadSinglePhoto = (req, res, next) => {
  try {
    if (!req.file) throw createError("No file uploaded", 400);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/photo/${req.file.filename}`;

    res.status(200).json({ url: fileUrl });
  } catch (err) {
    next(err);
  }
};

// Multiple evidence files tied to a complaint.
// complaint_id comes from validatedData (already Zod-checked upstream via route).
export const uploadComplaintEvidence = async (req, res, next) => {
  try {
    const { complaint_id } = req.validatedData;

    const uploaded_by_citizen_id = req.user?.role === "citizen" ? req.user.id : null;
    const uploaded_by_police_id = req.user?.role === "police" ? req.user.id : null;

    if (!req.files || req.files.length === 0) {
      throw createError("At least one evidence file is required", 400);
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const rows = req.files.map((file) => [
      complaint_id,
      uploaded_by_citizen_id ?? null,
      uploaded_by_police_id ?? null,
      `${baseUrl}/uploads/evidence/${file.filename}`,
      'photo',
    ]);

    const [result] = await db.query(
      `INSERT INTO complaint_evidence
        (complaint_id, uploaded_by_citizen_id, uploaded_by_police_id, link, evidence_type)
       VALUES ?`,
      [rows]
    );

    res.status(201).json({
      message: 'Evidence uploaded successfully',
      count: result.affectedRows,
      urls: rows.map((r) => r[3]),
    });
  } catch (err) {
    next(err);
  }
};

export const getEvidenceByComplaintId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT id, link, evidence_type, uploaded_at FROM complaint_evidence WHERE complaint_id = ?`,
      [id]
    );
    res.status(200).json(rows); // empty array if none — not an error
  } catch (err) {
    next(err);
  }
};