import { z } from "zod";
import dotenv from "dotenv"
dotenv.config();


const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(8000),
    SECRET_KEY: z.string().min(10, "Secret key is required"),
    DB_HOST: z.string().min(5, "host name is required"),
    DB_USER: z.string().min(1, "user is required"),
    DB_PASSWORD: z.string().min(8, "password is required"),
    DB_DATABASE: z.string().min(5, "database name is required"),
    NODE_ENV: z.enum(["production", "testing", "development"]).default("development")
})

const config = envSchema.safeParse(process.env)

if (!config.success) {
    console.error("Invalid environmental config:");
    const errors = config.error.flatten();
    console.error("Flattened error : ", errors)
    process.exit(1)
}

export default config.data  