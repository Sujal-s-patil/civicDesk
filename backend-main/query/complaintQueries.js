import db from "../db/sql.js";

export function getComplaints() {
    const [rows] = await db.query(`SELECT * FROM complaints WHERE status !='completed'`)
    return rows
}

export function createComplaint() { 
    
}

// CREATE TABLE complaints (
//     id                  INT AUTO_INCREMENT PRIMARY KEY,
//     complainant_name    VARCHAR(100) NOT NULL,
//     citizen_id          INT NOT NULL,
//     crime_type          VARCHAR(50) NOT NULL,
//     crime_description   TEXT NOT NULL,
//     crime_location      VARCHAR(255),
//     city                VARCHAR(50),
//     state               VARCHAR(50),
//     crime_date          DATE NOT NULL,
//     status              ENUM('Pending','In Progress','Resolved','Closed') NOT NULL DEFAULT 'Pending',
//     date_filed          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     last_updated        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (citizen_id) REFERENCES citizens(id)
// );