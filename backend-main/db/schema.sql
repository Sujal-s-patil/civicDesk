-- ============================================================
-- CivicDesk Database Schema (refactored, final)
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
-- id            = real surrogate PK (INT)
-- police_id     = business code e.g. 'P001', used for login
-- is_busy       = denormalized flag, kept in sync by app layer
--                 TRUE  → officer is actively assigned, cannot
--                         be assigned to any new complaint
--                 FALSE → officer is free to be assigned
--                 Source of truth is complaint_assignments below
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
-- Kanban stages in order: Pending → In Progress → Resolved → Closed
-- Resolved and Closed are both terminal: officers get freed on either
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
-- Many-to-many: one complaint → many officers
--               one officer  → many complaints (over time)
-- But an officer can NEVER have more than one active row
-- (released_at IS NULL) at a time — enforced in app layer
-- via transaction: check is_busy before inserting.
--
-- Officer release trigger: complaint status moves to
-- 'Resolved' OR 'Closed' → SET released_at = NOW() for all
-- active rows on that complaint + SET police.is_busy = FALSE
-- for each released officer. Done in a single transaction.
-- ------------------------------------------------------------
CREATE TABLE complaint_assignments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id    INT NOT NULL,
    police_id       INT NOT NULL,
    assigned_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at     TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (police_id)    REFERENCES police(id)    ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- complaint_evidence
-- Both citizens (on filing) and police (from detail modal)
-- can upload evidence.
-- Exactly one of uploaded_by_citizen_id / uploaded_by_police_id
-- should be set — enforced at application layer.
-- ------------------------------------------------------------
CREATE TABLE complaint_evidence (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id            INT NOT NULL,
    uploaded_by_citizen_id  INT DEFAULT NULL,
    uploaded_by_police_id   INT DEFAULT NULL,
    link                    TEXT NOT NULL,
    evidence_type           ENUM('photo','video','document') DEFAULT 'photo',
    uploaded_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id)           REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by_citizen_id) REFERENCES citizens(id),
    FOREIGN KEY (uploaded_by_police_id)  REFERENCES police(id)
);

-- ------------------------------------------------------------
-- complaint_comments
-- Only police can add comments (from complaint detail modal).
-- Replaces the old single `comment` VARCHAR column on ticket —
-- that got overwritten; this keeps full history.
-- ------------------------------------------------------------
CREATE TABLE complaint_comments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id    INT NOT NULL,
    police_id       INT NOT NULL,
    comment         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    FOREIGN KEY (police_id)    REFERENCES police(id)
);

-- ------------------------------------------------------------
-- criminal_records
-- Read-only from the police frontend — no CRUD, just display.
-- Not linked to complaints (police have no write access here).
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
-- Indexes for common query patterns
-- ------------------------------------------------------------
-- Kanban board filters by status
CREATE INDEX idx_complaints_status      ON complaints(status);
-- Citizen's own complaints lookup
CREATE INDEX idx_complaints_citizen     ON complaints(citizen_id);
-- "Is this officer currently active?" — used before every assign
CREATE INDEX idx_assignments_police_active ON complaint_assignments(police_id, released_at);
-- Fetch all officers on a complaint (for release on status change)
CREATE INDEX idx_assignments_complaint  ON complaint_assignments(complaint_id);
-- Fetch all evidence for a complaint detail modal
CREATE INDEX idx_evidence_complaint     ON complaint_evidence(complaint_id);
-- Fetch all comments for a complaint detail modal
CREATE INDEX idx_comments_complaint     ON complaint_comments(complaint_id);