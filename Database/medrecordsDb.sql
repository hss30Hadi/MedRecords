Create Database fyp_medrecords;
Use fyp_medrecords;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    verification_code VARCHAR(255),
    is_verified TINYINT DEFAULT 0,
    profile_pic VARCHAR(255)
);
