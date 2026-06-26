import { z } from "zod";

const loginCitizenSchema = z.object({
  aadhar_card: z.string().trim().length(12, "Aadhar card must be exactly 12 digits").regex(/^\d+$/, "Aadhar card must contain only digits"),
  password: z.string().trim().min(1, "password is required")
}).strict()


const registerCitizenSchema = z.object({
  aadhar_card: z.string().trim().length(12, "Aadhar card must be exactly 12 digits").regex(/^\d+$/, "Aadhar card must contain only digits"),
  password: z.string().trim().min(1, "password is required"),
  photo: z.string().trim().optional(),
  email: z.string().email().optional(),
  phone_no: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number").optional(),
  full_name: z.string().trim().min(1, "full name is required"),
  address: z.string().trim().min(1, "address is required"),
  city: z.string().trim().min(1, "city is required"),
  state: z.string().trim().min(1, "state is required")
}).strict()


export {
  loginCitizenSchema, registerCitizenSchema
}