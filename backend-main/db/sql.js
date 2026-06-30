import mysql from "mysql2"
import config from "../config/env.js"

const db = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE
}).promise();


export default db