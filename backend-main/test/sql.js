// CREATE TABLE citizens (
//     id              INT AUTO_INCREMENT PRIMARY KEY,
//     photo           VARCHAR(255) DEFAULT NULL,
//     aadhar_card     BIGINT NOT NULL UNIQUE,
//     password        VARCHAR(255) NOT NULL,
//     email           VARCHAR(255) UNIQUE DEFAULT NULL,
//     phone_no        BIGINT,
//     full_name       VARCHAR(255) NOT NULL,
//     address         VARCHAR(255),
//     city            VARCHAR(50),
//     state           VARCHAR(50),
//     created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

const body = {
    "aadhar_card": 123456789123,
    "password": "sujalpatil",
    "phone_no":1234567891,
    "full_name":"sujal patil",
    "address":"type shit",
    "city":"bhiwandi",
    "state":"maharashtra"
}