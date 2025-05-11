
CREATE DATABASE IF NOT EXISTS smart_finder;
USE smart_finder;


CREATE TABLE Role (
    role_id  TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name     ENUM('regular', 'plus', 'admin') NOT NULL UNIQUE
);


CREATE TABLE User (
    user_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(60)     NOT NULL,       
    join_date     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE User_role (
    user_id    BIGINT UNSIGNED NOT NULL,
    role_id    TINYINT UNSIGNED NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);


CREATE TABLE Deli (
    deli_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(120) NOT NULL,
    address   VARCHAR(255),
    phone     VARCHAR(20),
    place_id  VARCHAR(100)
);


CREATE TABLE Sandwich (
    sandwich_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description TEXT
);


CREATE TABLE Price_listing (
    price_id      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    deli_id       BIGINT UNSIGNED NOT NULL,
    sandwich_id   BIGINT UNSIGNED NOT NULL,
    submitted_by  BIGINT UNSIGNED,                 
    price         DECIMAL(5,2) NOT NULL,
    listing_type  ENUM('business','user','potential') NOT NULL,
    is_approved   BOOLEAN DEFAULT FALSE,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deli_id)      REFERENCES Deli(deli_id),
    FOREIGN KEY (sandwich_id)  REFERENCES Sandwich(sandwich_id),
    FOREIGN KEY (submitted_by) REFERENCES User(user_id)
);


CREATE TABLE Review (
    review_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED NOT NULL,
    deli_id      BIGINT UNSIGNED NOT NULL,
    rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    date_posted  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (deli_id) REFERENCES Deli(deli_id)
);


CREATE TABLE Favorite (
    user_id  BIGINT UNSIGNED NOT NULL,
    deli_id  BIGINT UNSIGNED NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, deli_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (deli_id) REFERENCES Deli(deli_id)
);

CREATE TABLE Image (
    image_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    deli_id     BIGINT UNSIGNED,
    sandwich_id BIGINT UNSIGNED,
    uploaded_by BIGINT UNSIGNED,
    url         VARCHAR(255) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deli_id)     REFERENCES Deli(deli_id),
    FOREIGN KEY (sandwich_id) REFERENCES Sandwich(sandwich_id),
    FOREIGN KEY (uploaded_by) REFERENCES User(user_id)
);