import express from "express";
import { criminalRegister, criminalRecords, getCriminal, searchCriminals } from "../controllers/criminal.js";
import validateSchema from "../middlewares/validateSchema.js";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { criminalCreateSchema, criminalSearchSchema } from "../schemas/criminalSchema.js";

const criminalRouter = express.Router();

criminalRouter.post("/register", verifyToken, requireRole("police"), validateSchema(criminalCreateSchema), criminalRegister);
criminalRouter.get("/records", verifyToken, requireRole("police"), criminalRecords);
criminalRouter.post("/search", verifyToken, requireRole("police"), validateSchema(criminalSearchSchema), searchCriminals);
criminalRouter.get("/:id", verifyToken, requireRole("police"), getCriminal);

export default criminalRouter;