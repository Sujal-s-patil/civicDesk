import { z } from "zod";

const loginSchema = z.object({
    police_id: z.string().trim().min(5, "police id is required"),
    password: z.string().trim().min(1, "password is required")
}).strict()

const registerSchema = z.object({
    police_id: z.string().trim().min(5, "police id is required"),
    photo: z.string().trim().min(5, "photo is required").optional(),
    aadhar_card: z.string().trim().length(12, "Aadhar card must be exactly 12 digits").regex(/^\d+$/, "Aadhar card must contain only digits"),
    password: z.string().trim().min(1, "password is required"),
    full_name: z.string().trim().min(5, "full name is required"),
    phone_no: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
    email: z.string().email().optional(),
    address: z.string().trim().min(5, "address is required"),
    city: z.string().trim().min(5, "city is required"),
    state: z.string().trim().min(5, " state is required"),
    blood_group: z.string().trim().min(1, "blood group is required").optional(),
    post: z.string().trim().min(1, "post is required"),
    speciality: z.string().trim().min(1, "speciality is required").optional(),
    description: z.string().trim().min(1, "description is required").optional(),
    gender: z.string().enum(["Male", "Female", "Other"]).default("Male"),
    is_busy: z.boolean().default(false)
}).strict()

const assignPoliceSchema = z.object({
  complaint_id: z.number().int().positive("Complaint ID must be a positive number"),
  police_id: z.number().int().positive("Police ID must be a positive number"),
}).strict();

const unassignPoliceSchema = z.object({
  complaint_id: z.number().int().positive("Complaint ID must be a positive number"),
}).strict();

export {
  loginSchema, registerSchema, assignPoliceSchema, unassignPoliceSchema
};