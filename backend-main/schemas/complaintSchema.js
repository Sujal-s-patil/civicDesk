import { z } from "zod";

const complaintCreateSchema = z.object({
  complainant_name: z.string().trim().min(1, "Complainant name is required").max(100),
  citizen_id: z.number().int().positive("Citizen ID must be a positive number"),
  crime_type: z.string().trim().min(1, "Crime type is required").max(50),
  crime_description: z.string().trim().min(1, "Crime description is required"),
  crime_location: z.string().trim().min(1).optional().nullable(),
  city: z.string().trim().min(1).optional().nullable(),
  state: z.string().trim().min(1).optional().nullable(),
  crime_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Crime date must be in YYYY-MM-DD format"),
  status: z.enum(["Pending", "In Progress", "Resolved", "Closed"]).default("Pending").optional(),
}).strict();

const complaintCommentCreateSchema = z.object({
  complaint_id: z.number().int().positive("Complaint ID must be a positive number"),
  police_id: z.number().int().positive("Police ID must be a positive number"),
  comment: z.string().trim().min(1, "Comment cannot be empty"),
}).strict();


const complaintAssignmentCreateSchema = z.object({
  complaint_id: z.number().int().positive("Complaint ID must be a positive number"),
  police_id: z.number().int().positive("Police ID must be a positive number"),
  assigned_at: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "Assigned timestamp must be a valid ISO date-time").optional(),
  released_at: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "Released timestamp must be a valid ISO date-time").optional().nullable(),
}).strict();

const complaintEvidenceCreateSchema = z
  .object({
    complaint_id: z.number().int().positive("Complaint ID must be a positive number"),
    uploaded_by_citizen_id: z.number().int().positive().optional().nullable(),
    uploaded_by_police_id: z.number().int().positive().optional().nullable(),
    link: z.string().trim().min(1, "Evidence link is required"),
    evidence_type: z.enum(["photo", "video", "document"]).default("photo").optional(),
    uploaded_at: z.string().regex(/^\d{4}-\d{2}-\d{2}(T.*)?$/, "Uploaded timestamp must be a valid ISO date-time").optional(),
  })
  .strict()
  .refine(
    (data) => Boolean(data.uploaded_by_citizen_id || data.uploaded_by_police_id),
    { message: "Either uploaded_by_citizen_id or uploaded_by_police_id must be provided" }
  );

const complaintStatusSchema = z.object({
  complaint_id: z.number().int().positive("Complaint ID must be a positive number"),
  status: z.enum(["Pending", "In Progress", "Resolved", "Closed"]),
}).strict();

const complaintEvidenceUploadSchema = z
  .object({
    complaint_id: z.coerce.number().int().positive("Complaint ID must be a positive number"),
    uploaded_by_citizen_id: z.coerce.number().int().positive().optional().nullable(),
    uploaded_by_police_id: z.coerce.number().int().positive().optional().nullable(),
  })
  .strict()
  .refine(
    (data) => Boolean(data.uploaded_by_citizen_id || data.uploaded_by_police_id),
    { message: "Either uploaded_by_citizen_id or uploaded_by_police_id must be provided" }
  );



export {
  complaintCreateSchema,
  complaintCommentCreateSchema,
  complaintAssignmentCreateSchema,
  complaintEvidenceCreateSchema,
  complaintStatusSchema,
  complaintEvidenceUploadSchema
};