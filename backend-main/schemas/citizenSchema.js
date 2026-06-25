import { z } from "zod";

const loginCitizenSchema = z.object({
  aadhar_card: z.number(),
  password: z.string().min(10, "password must be 10 character long")
}).strict()


const registerCitizenSchema = z.object({
  aadhar_card: z.number(),
  password: z.string().min(10, "password must be 10 character long"),
  photo: z.string().trim().optional(),
  email: z.email().optional(),
  phone_no: z.number(),
  full_name: z.string().trim().min(1, "full name is required"),
  address: z.string().trim().min(1, "address is required"),
  city: z.string().trim().min(1, "city is required"),
  state: z.string().trim().min(1, "state is required")
}).strict()
