import bcrypt from "bcrypt";
import config from "../config/env.js";
import {
  insertPolice,
  findByPoliceId,
  getAllPolice,
  getPoliceById,
  assignPoliceToComplaint,
  releasePoliceFromComplaint,
} from "../query/policeQueries.js";
import { createError } from "../utils/createError.js";
import { createToken } from "../utils/jwt.js";
import setAuthCookie from "../utils/cookie.js";

export const policeRegister = async (req, res, next) => {
  try {
    const { password } = req.validatedData;
    req.validatedData.password = await bcrypt.hash(password, 10);
    const id = await insertPolice(req.validatedData);
    res.status(201).json({ success: true, message: "Officer registered successfully", id });
  } catch (error) {
    next(error);
  }
};

export const policeLogin = async (req, res, next) => {
  try {
    const { police_id, password } = req.validatedData;
    const officer = await findByPoliceId(police_id);
    if (!officer) throw createError("Officer does not exist", 404);

    const match = await bcrypt.compare(password, officer.password);
    if (!match) throw createError("Police ID or password is incorrect", 401);

    delete officer.password;

    const token = createToken({ ...officer, role: "police" });
    setAuthCookie(res, token)

    res.status(200).json({ success: true, message: "Logged in successfully", data: officer });
  } catch (error) {
    next(error);
  }
};

export const getTeamInfo = async (req, res, next) => {
  try {
    const rows = await getAllPolice();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const officer = await getPoliceById(id);
    if (!officer) throw createError("Officer not found", 404);
    delete officer.password;
    res.status(200).json(officer);
  } catch (error) {
    next(error);
  }
};

export const assignPolice = async (req, res, next) => {
  try {
    const { complaint_id, police_id } = req.validatedData;
    await assignPoliceToComplaint(complaint_id, police_id);
    res.status(200).json({ message: "Officer assigned successfully" });
  } catch (error) {
    next(error);
  }
};

export const unassignPolice = async (req, res, next) => {
  try {
    const { complaint_id } = req.validatedData;
    const count = await releasePoliceFromComplaint(complaint_id);
    if (count === 0) throw createError("No active assignment found for this complaint", 404);
    res.status(200).json({ message: "Officer(s) unassigned successfully" });
  } catch (error) {
    next(error);
  }
};