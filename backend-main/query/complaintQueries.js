import db from "../db/sql.js";

export async function getActiveComplaints() {
  const [rows] = await db.query(
    `SELECT * FROM complaints WHERE status != 'Closed'`
  );
  return rows;
}

export async function createComplaint(data) {
  const {
    complainant_name, citizen_id, crime_type, crime_description,
    crime_location, city, state, crime_date, status,
  } = data;

  const [result] = await db.query(
    `INSERT INTO complaints
      (complainant_name, citizen_id, crime_type, crime_description, crime_location, city, state, crime_date, status)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [complainant_name, citizen_id, crime_type, crime_description, crime_location ?? null, city ?? null, state ?? null, crime_date, status ?? 'Pending']
  );
  return result.insertId;
}

export async function getComplaintById(id) {
  const [rows] = await db.query(`SELECT * FROM complaints WHERE id = ?`, [id]);
  return rows[0] ?? null;
}

export async function getComplaintsByCitizenId(citizenId) {
  const [rows] = await db.query(
    `SELECT * FROM complaints WHERE citizen_id = ? ORDER BY id DESC`,
    [citizenId]
  );
  return rows;
}

export async function getLastComplaintId() {
  const [rows] = await db.query(`SELECT id FROM complaints ORDER BY id DESC LIMIT 1`);
  return rows[0]?.id ?? null;
}

export async function updateComplaintStatus(complaint_id, status) {
  const [result] = await db.query(
    `UPDATE complaints SET status = ? WHERE id = ?`,
    [status, complaint_id]
  );
  return result.affectedRows;
}

export async function addComplaintComment(complaint_id, police_id, comment) {
  const [result] = await db.query(
    `INSERT INTO complaint_comments (complaint_id, police_id, comment) VALUES (?,?,?)`,
    [complaint_id, police_id, comment]
  );
  return result.insertId;
}

export async function getCommentsByComplaintId(complaint_id) {
  const [rows] = await db.query(
    `SELECT id, police_id, comment, created_at FROM complaint_comments WHERE complaint_id = ?`,
    [complaint_id]
  );
  return rows;
}