import express from "express";
import {
  getTeamInfo, policeLogin, policeRegister,
  assignPolice, unassignPolice, getUserById,
} from "../controllers/police.js";
import validateSchema from "../middlewares/validateSchema.js";
import { verifyToken, requireRole } from "../middlewares/auth.js";
import { loginSchema, registerSchema, assignPoliceSchema, unassignPoliceSchema } from "../schemas/policeSchema.js";

const policeRouter = express.Router();

policeRouter.get("/team", verifyToken, requireRole("police"), getTeamInfo);
policeRouter.post("/login", validateSchema(loginSchema), policeLogin);
policeRouter.post("/register", validateSchema(registerSchema), policeRegister);
policeRouter.put("/assign", verifyToken, requireRole("police"), validateSchema(assignPoliceSchema), assignPolice);
policeRouter.put("/unassign", verifyToken, requireRole("police"), validateSchema(unassignPoliceSchema), unassignPolice);
policeRouter.get("/:id", verifyToken, requireRole("police"), getUserById);

export default policeRouter;