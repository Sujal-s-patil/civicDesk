import db from "../db/sql.js";
import { createError } from "../utils/createError.js";

export async function insertCriminal(data) {
  const {
    photo, name, aadhar_card, address, city, state, date_of_birth,
    jail_address, jail_city, jail_state, phone_no, crime, date_of_arrest,
    sentence_duration, status, description, gender,
  } = data;

  try {
    const [result] = await db.query(
      `INSERT INTO criminal_records
        (photo, name, aadhar_card, address, city, state, date_of_birth, jail_address, jail_city, jail_state, phone_no, crime, date_of_arrest, sentence_duration, status, description, gender)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        photo ?? null, name, aadhar_card ?? null, address ?? null, city ?? null, state ?? null,
        date_of_birth ?? null, jail_address, jail_city, jail_state, phone_no ?? null, crime,
        date_of_arrest, sentence_duration ?? null, status ?? 'Incarcerated', description ?? null, gender ?? 'Male',
      ]
    );
    return result.insertId;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      throw createError("Criminal record already exists for this Aadhar number", 409);
    }
    throw error;
  }
}

export async function getAllCriminals() {
  const [rows] = await db.query(`SELECT * FROM criminal_records ORDER BY created_at DESC`);
  return rows;
}

export async function getCriminalById(id) {
  const [rows] = await db.query(`SELECT * FROM criminal_records WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

export async function findCriminalsByName(name) {
  const [rows] = await db.query(
    `SELECT * FROM criminal_records WHERE name LIKE ?`,
    [`%${name}%`]
  );
  return rows;
}