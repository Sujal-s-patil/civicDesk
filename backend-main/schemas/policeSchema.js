import { z } from "zod";

const loginSchema = z.object({
    police_id: z.string().min(5, "police id is required"),
    password: z.string().min(5, "password is required")
}).strict()

const registerSchema = z.object({
    police_id: z.string().min(5, "police id is required"),
    photo: z.string().min(5, "photo id is required").optional(),
    aadhar_card: z.coerce.number().int().positive().min(10000, "aadhar number is required"),
    password: z.string().min(5, "password id is required"),
    full_name: z.string().min(5, "full name id is required"),
    phone_no: z.coerce.number().int().positive().min(100000, "phone number id is required").optional(),
    email: z.string().min(5, "email id is required").optional(),
    address: z.string().min(5, "address id is required"),
    city: z.string().min(5, "city is required"),
    state: z.string().min(5, " state is required"),
    blood_group: z.string().min(1, "blood group is required").optional(),
    post
})

//     blood_group VARCHAR(10) DEFAULT NULL,
//     post VARCHAR(255),
//     speciality VARCHAR(255) DEFAULT NULL,
//     description TEXT DEFAULT NULL,
//     gender VARCHAR(10) DEFAULT 'Male',
//     -- Male or Female
//     occupied BOOLEAN DEFAULT FALSE,
//     complaint_id INT DEFAULT NULL
// );
