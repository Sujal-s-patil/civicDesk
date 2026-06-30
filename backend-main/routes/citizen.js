import express from "express";
const citizenRouter = express.Router();

import { citizenLogin, citizenRegister } from "../controllers/citizen.js"
import validateSchema from "../middlewares/validateSchema.js"
import { verifyToken, requireRole } from "../middlewares/auth.js"
import { registerCitizenSchema, loginCitizenSchema } from "../schemas/citizenSchema.js"

citizenRouter.post("/register", validateSchema(registerCitizenSchema), citizenRegister);
citizenRouter.post("/login", validateSchema(loginCitizenSchema), citizenLogin);
citizenRouter.get("/profile", verifyToken, requireRole("citizen"), (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

export default citizenRouter