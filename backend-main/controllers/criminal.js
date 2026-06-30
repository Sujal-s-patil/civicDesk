import {
  insertCriminal,
  getAllCriminals,
  getCriminalById,
  findCriminalsByName,
} from "../query/criminalQueries.js";
import { createError } from "../utils/createError.js";

export const criminalRegister = async (req, res, next) => {
  try {
    const id = await insertCriminal(req.validatedData);
    res.status(201).json({ success: true, message: "Criminal record created successfully", id });
  } catch (error) {
    next(error);
  }
};

export const criminalRecords = async (req, res, next) => {
  try {
    const rows = await getAllCriminals();
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getCriminal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = await getCriminalById(id);
    if (!record) throw createError("Criminal record not found", 404);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

export const searchCriminals = async (req, res, next) => {
  try {
    const { name } = req.validatedData;
    const rows = await findCriminalsByName(name);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};