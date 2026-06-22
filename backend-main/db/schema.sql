-- ============================================================
-- CivicDesk Database Schema (refactored)
-- ============================================================

CREATE DATABASE IF NOT EXISTS civic_desk;
USE civic_desk;

-- ------------------------------------------------------------
-- citizens (renamed from `public` — reserved keyword in SQL)
-- ------------------------------------------------------------
CREATE TABLE citizens (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    photo           VARCHAR(255) DEFAULT NULL,
    aadhar_card     BIGINT NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE DEFAULT NULL,
    phone_no        BIGINT,
    full_name       VARCHAR(255) NOT NULL,
    address         VARCHAR(255),
    city            VARCHAR(50),
    state           VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- police
-- id            = real surrogate PK
-- police_id     = business code (e.g. 'P001'), used for login
-- is_busy       = denormalized cache, kept in sync by app layer.
--                 TRUE means officer cannot be assigned to any
--                 new complaint until current one is Resolved.
--                 Source of truth for assignment history is the
--                 complaint_assignments table below.
-- ------------------------------------------------------------
CREATE TABLE police (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    police_id       VARCHAR(50) NOT NULL UNIQUE,
    photo           VARCHAR(255) DEFAULT NULL,
    aadhar_card     BIGINT NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone_no        BIGINT,
    email           VARCHAR(255) UNIQUE DEFAULT NULL,
    address         TEXT,
    city            VARCHAR(255),
    state           VARCHAR(255),
    blood_group     VARCHAR(10) DEFAULT NULL,
    post            VARCHAR(255),
    speciality      VARCHAR(255) DEFAULT NULL,
    description     TEXT DEFAULT NULL,
    gender          ENUM('Male','Female','Other') DEFAULT 'Male',
    is_busy         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- complaints (renamed from `ticket`)
-- status ENUM matches the exact Kanban columns:
-- Pending -> In Progress -> Resolved
-- ------------------------------------------------------------
CREATE TABLE complaints (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    complainant_name    VARCHAR(100) NOT NULL,
    citizen_id          INT NOT NULL,
    crime_type          VARCHAR(50) NOT NULL,
    crime_description   TEXT NOT NULL,
    crime_location      VARCHAR(255),
    city                VARCHAR(50),
    state               VARCHAR(50),
    crime_date          DATE NOT NULL,
    status              ENUM('Pending','In Progress','Resolved','Closed') NOT NULL DEFAULT 'Pending',
    date_filed          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id)
);

-- ------------------------------------------------------------
-- complaint_assignments
-- Join table for the many-to-many: one complaint can have many
-- officers, one officer can (over time) have many complaints,
-- but NEVER more than one ACTIVE (released_at IS NULL) row at
-- a given moment per officer — enforced at the application/
-- transaction layer, since MySQL has no native partial unique
-- index on "released_at IS NULL".
-- Officers are released (released_at = NOW(), is_busy = FALSE)
-- when a complaint reaches either 'Resolved' or 'Closed'
-- (both are terminal statuses).
-- ------------------------------------------------------------
CREATE TABLE complaint_assignments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id    INT NOT NULL,
    police_id       INT NOT NULL,
    assigned_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at     TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (police_id) REFERENCES police(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- complaint_evidence (renamed from `links`)
-- ------------------------------------------------------------
CREATE TABLE complaint_evidence (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id    INT NOT NULL,
    uploaded_by     INT NOT NULL,
    link            TEXT NOT NULL,
    evidence_type   ENUM('photo','video','document') DEFAULT 'photo',
    uploaded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES police(id)
);

-- ------------------------------------------------------------
-- complaint_comments (replaces the old single `comment` column)
-- ------------------------------------------------------------
CREATE TABLE complaint_comments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id    INT NOT NULL,
    police_id       INT NOT NULL,
    comment         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (police_id) REFERENCES police(id)
);

-- ------------------------------------------------------------
-- criminal_records (read-only to police frontend — no FKs to
-- complaints since police have no CRUD over this table)
-- ------------------------------------------------------------
CREATE TABLE criminal_records (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    photo               VARCHAR(255) DEFAULT NULL,
    name                VARCHAR(100) NOT NULL,
    aadhar_card         BIGINT DEFAULT NULL,
    address             TEXT,
    city                VARCHAR(50),
    state               VARCHAR(50),
    date_of_birth       DATE,
    jail_address        TEXT,
    jail_city           VARCHAR(50),
    jail_state          VARCHAR(50),
    phone_no            BIGINT,
    crime               VARCHAR(255) NOT NULL,
    date_of_arrest      DATE NOT NULL,
    sentence_duration   INT COMMENT 'in months',
    status              ENUM('Incarcerated','Released','Probation') DEFAULT 'Incarcerated',
    description         TEXT,
    gender              ENUM('Male','Female','Other') DEFAULT 'Male',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Helpful indexes for common lookups
-- ------------------------------------------------------------
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_citizen ON complaints(citizen_id);
CREATE INDEX idx_assignments_police_active ON complaint_assignments(police_id, released_at);
CREATE INDEX idx_assignments_complaint ON complaint_assignments(complaint_id);
CREATE INDEX idx_evidence_complaint ON complaint_evidence(complaint_id);
CREATE INDEX idx_comments_complaint ON complaint_comments(complaint_id);