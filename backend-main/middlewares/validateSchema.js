import { z } from "zod";
import { createError } from "../utils/createError.js"

const validateSchema = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        const error = JSON.parse(result.error.message)
        return res.status(400).json({ success: false, message: error })
    }

    req.validatedData = result.data
    next()
}

export default validateSchema