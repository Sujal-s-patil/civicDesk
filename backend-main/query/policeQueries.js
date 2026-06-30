import db from "../db/sql.js";
import { createError } from "../utils/createError.js";

export async function insertPolice(data) {
    const {
        police_id, photo, aadhar_card, password, full_name, phone_no,
        email, address, city, state, blood_group, post, speciality,
        description, gender, is_busy,
    } = data;
    try {
        const [result] = await db.query(
            `INSERT INTO police
        (police_id, photo, aadhar_card, password, full_name, phone_no, email, address, city, state, blood_group, post, speciality, description, gender, is_busy)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [police_id, photo ?? null, aadhar_card, password, full_name, phone_no, email ?? null, address, city, state, blood_group ?? null, post, speciality ?? null, description ?? null, gender, is_busy ?? false]
        );
        return result.insertId;
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            throw createError("Police officer already exists", 409);
        }
        throw error;
    }
}

export async function findByPoliceId(police_id) {
    const [rows] = await db.query(`SELECT * FROM police WHERE police_id = ?`, [police_id]);
    return rows[0] ?? null;
}

export async function getAllPolice() {
    const [rows] = await db.query(`SELECT id, police_id, full_name, post, city, state, is_busy FROM police`);
    return rows;
}

export async function getPoliceById(id) {
    const [rows] = await db.query(`SELECT * FROM police WHERE id = ?`, [id]);
    return rows[0] ?? null;
}

// Transaction: check officer is free, assign, mark busy — atomic.
export async function assignPoliceToComplaint(complaint_id, police_id) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [officerRows] = await conn.query(
            `SELECT is_busy FROM police WHERE id = ? FOR UPDATE`,
            [police_id]
        );
        if (officerRows.length === 0) throw createError("Officer not found", 404);
        if (officerRows[0].is_busy) throw createError("Officer is already assigned to a complaint", 409);

        await conn.query(
            `INSERT INTO complaint_assignments (complaint_id, police_id) VALUES (?, ?)`,
            [complaint_id, police_id]
        );
        await conn.query(`UPDATE police SET is_busy = TRUE WHERE id = ?`, [police_id]);

        await conn.commit();
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

// Releases ALL active officers on a complaint — called when status → Resolved/Closed
export async function releasePoliceFromComplaint(complaint_id) {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [activeRows] = await conn.query(
            `SELECT police_id FROM complaint_assignments WHERE complaint_id = ? AND released_at IS NULL`,
            [complaint_id]
        );

        await conn.query(
            `UPDATE complaint_assignments SET released_at = NOW() WHERE complaint_id = ? AND released_at IS NULL`,
            [complaint_id]
        );

        for (const row of activeRows) {
            await conn.query(`UPDATE police SET is_busy = FALSE WHERE id = ?`, [row.police_id]);
        }

        await conn.commit();
        return activeRows.length;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}