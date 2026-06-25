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

// Error: Duplicate entry 'asksasjan@jas.com' for key 'citizens.email'
//     at PromisePool.query (/home/patil/Documents/projects/civicDesk/backend-main/node_modules/mysql2/promise.js:356:22)
//     at insertCitizen (file:///home/patil/Documents/projects/civicDesk/backend-main/query/citizenQueries.js:6:31)
//     at citizenRegister (file:///home/patil/Documents/projects/civicDesk/backend-main/controllers/citizen.js:16:32) {
//   code: 'ER_DUP_ENTRY',
//   errno: 1062,
//   sql: "INSERT INTO citizens (aadhar_card, password, phone_no, full_name, address, city, state,photo,email ) VALUES ('123956787123','$2b$10$qozmBGnRB5MXQKHyAnW23uAI3dY./lZhPDZr0nUmdxRqsQdTXevOu',1234567891,'sujal patil','sonale','bhiwandi','maharashtra',NULL,'asksasjan@jas.com')",
//   sqlState: '23000',
//   sqlMessage: "Duplicate entry 'asksasjan@jas.com' for key 'citizens.email'"
// }


