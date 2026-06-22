// const db = require("../db/sql.js")
import db from "../db/sql.js"

async function dd() {
    const [rows] = await db.query("select * from police;")
    console.log(rows)
}
dd()