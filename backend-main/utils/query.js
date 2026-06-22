import db from "../db/sql.js"


export async function insertQuery(data, table) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => "?").join(',')
    const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    const responce = await db.query(query, values);
    return responce
}

export async function findExist(table, column, data) {
    const responce = await db.query(`SELECT * FROM ${table} WHERE ${column} = ?`, [data]);
    return responce
}