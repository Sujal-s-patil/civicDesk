import { z } from "zod";

const criminalCreateSchema = z.object({
  photo: z.string().trim().max(255).optional().nullable(),
  name: z.string().trim().min(1, "Name is required").max(100),
  aadhar_card: z
    .string()
    .trim()
    .length(12, "Aadhar card must be exactly 12 digits")
    .regex(/^\d+$/, "Aadhar card must contain only digits")
    .optional()
    .nullable(),
  address: z.string().trim().min(1).optional().nullable(),
  city: z.string().trim().max(50).optional().nullable(),
  state: z.string().trim().max(50).optional().nullable(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional()
    .nullable(),
  jail_address: z.string().trim().min(1, "Jail address is required"),
  jail_city: z.string().trim().min(1, "Jail city is required").max(50),
  jail_state: z.string().trim().min(1, "Jail state is required").max(50),
  phone_no: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number").optional().nullable(),
  crime: z.string().trim().min(1, "Crime is required").max(255),
  date_of_arrest: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  sentence_duration: z.number().int("Sentence duration must be a whole number").positive("Sentence duration must be positive").optional().nullable(),
  status: z.enum(["Incarcerated", "Released", "Probation"]).default("Incarcerated").optional(),
  description: z.string().trim().optional().nullable(),
  gender: z.enum(["Male", "Female", "Other"]).default("Male").optional(),
}).strict();


// add to existing file
const criminalSearchSchema = z.object({
  name: z.string().trim().min(1, "Search name is required"),
}).strict();

export { criminalCreateSchema, criminalSearchSchema };