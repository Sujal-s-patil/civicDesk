import db from "../db/sql.js"


export async function insertCitizen(data) {
    const { aadhar_card, password, phone_no, full_name, address, city, state, photo, email } = data
    const responce = await db.query(`INSERT INTO citizens (aadhar_card, password, phone_no, full_name, address, city, state,photo,email ) VALUES (?,?,?,?,?,?,?,?,?)`, [aadhar_card, password, phone_no, full_name, address, city, state, photo, email]);
    return responce
}

export async function findByAadhar(aadhar_card) {
    const [rows] = await db.query(`SELECT * FROM citizens WHERE aadhar_card = ?`, [aadhar_card]);
    return rows[0] ?? null
}