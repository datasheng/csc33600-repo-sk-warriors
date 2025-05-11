CREATE DATABASE IF NOT EXISTS smart_finder;
USE smart_finder;

CREATE TABLE IF NOT EXISTS Role (
    role_id  TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name     ENUM('regular', 'plus', 'admin') NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS User (
    user_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(60)     NOT NULL,       
    join_date     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS User_role (
    user_id    BIGINT UNSIGNED NOT NULL,
    role_id    TINYINT UNSIGNED NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

CREATE TABLE IF NOT EXISTS Deli (
    deli_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(120) NOT NULL,
    address   VARCHAR(255),
    phone     VARCHAR(20),
    place_id  VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Sandwich (
    sandwich_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS Price_listing (
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

CREATE TABLE IF NOT EXISTS Review (
    review_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED NOT NULL,
    deli_id      BIGINT UNSIGNED NOT NULL,
    rating       TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment      TEXT,
    date_posted  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (deli_id) REFERENCES Deli(deli_id)
);

CREATE TABLE IF NOT EXISTS Favorite (
    user_id  BIGINT UNSIGNED NOT NULL,
    deli_id  BIGINT UNSIGNED NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, deli_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (deli_id) REFERENCES Deli(deli_id)
);

CREATE TABLE IF NOT EXISTS Image (
    image_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    deli_id     BIGINT UNSIGNED,
    sandwich_id BIGINT UNSIGNED,
    uploaded_by BIGINT UNSIGNED,
    url         VARCHAR(255) NOT NULL,
    is_profile  BOOLEAN DEFAULT FALSE,
    context     VARCHAR(50),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deli_id)     REFERENCES Deli(deli_id),
    FOREIGN KEY (sandwich_id) REFERENCES Sandwich(sandwich_id),
    FOREIGN KEY (uploaded_by) REFERENCES User(user_id)
);

CREATE TABLE IF NOT EXISTS Contact_message (
    message_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100),
    email        VARCHAR(150) NOT NULL,
    message      TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Plan (
    plan_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL,
    price      DECIMAL(6,2) NOT NULL,
    duration   INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Subscription (
    subscription_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    plan_id         BIGINT UNSIGNED NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (plan_id) REFERENCES Plan(plan_id)
);

CREATE TABLE IF NOT EXISTS Payment (
    payment_id      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    subscription_id BIGINT UNSIGNED NOT NULL,
    amount          DECIMAL(6,2) NOT NULL,
    payment_date    DATETIME DEFAULT CURRENT_TIMESTAMP,
    method          ENUM('card', 'paypal', 'bank') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (subscription_id) REFERENCES Subscription(subscription_id)
);

-- Create and grant user
CREATE USER IF NOT EXISTS 'team_user'@'%' IDENTIFIED BY 'SkWarriors23336';
GRANT ALL PRIVILEGES ON smart_finder.* TO 'team_user'@'%';
FLUSH PRIVILEGES;
