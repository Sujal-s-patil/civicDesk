import express from "express";
const citizenRouter = express.Router();

import { citizenLogin, citizenRegister } from "../controllers/citizen.js"
import validateSchema from "../middlewares/validateSchema.js"
import { registerCitizenSchema, loginCitizenSchema } from "../schemas/citizenSchema.js"

citizenRouter.post("/register", validateSchema(registerCitizenSchema), citizenRegister);
citizenRouter.post("/login", validateSchema(loginCitizenSchema), citizenLogin);

export default citizenRouter