import db from "../db/sql.js"
import { createError } from "../utils/createError.js"

export async function insertCitizen(data) {
    const { aadhar_card, password, phone_no, full_name, address, city, state, photo, email } = data
    try {
        const responce = await db.query(`INSERT INTO citizens (aadhar_card, password, phone_no, full_name, address, city, state,photo,email ) VALUES (?,?,?,?,?,?,?,?,?)`, [aadhar_card, password, phone_no, full_name, address, city, state, photo, email]);
        return responce
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            throw createError("User already exist", 409)
        }
        throw err
    }
}

export async function findByAadhar(aadhar_card) {
    const [rows] = await db.query(`SELECT * FROM citizens WHERE aadhar_card = ?`, [aadhar_card]);
    return rows[0] ?? null
}