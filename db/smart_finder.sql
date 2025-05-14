CREATE DATABASE IF NOT EXISTS smart_finder;
USE smart_finder;

-- ROLES
CREATE TABLE IF NOT EXISTS Role (
    role_id  TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name     ENUM('regular', 'plus', 'admin') NOT NULL UNIQUE
);

-- USERS
CREATE TABLE IF NOT EXISTS User (
    user_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password_hash CHAR(60)     NOT NULL,       
    join_date     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS UserRole (
    user_id    BIGINT UNSIGNED NOT NULL,
    role_id    TINYINT UNSIGNED NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (role_id) REFERENCES Role(role_id)
);

-- DELIS AND PRODUCTS
CREATE TABLE IF NOT EXISTS Deli (
    deli_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_name      VARCHAR(120) NOT NULL,
    store_address   VARCHAR(255),
    phone     VARCHAR(20),
    place_id  VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Sandwich (
    sandwich_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS PriceListing (
    price_id      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    deli_id       BIGINT UNSIGNED NOT NULL,
    sandwich_id   BIGINT UNSIGNED NOT NULL,
    submitted_by  BIGINT UNSIGNED NOT NULL,
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

-- CONTACT
CREATE TABLE IF NOT EXISTS ContactMessage (
    message_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100),
    email        VARCHAR(150) NOT NULL,
    message      TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- PLANS AND SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS Plan (
    plan_id    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE, 
    price      DECIMAL(6,2) NOT NULL,
    duration   INT NOT NULL COMMENT 'In days',
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

-- WAITLIST
CREATE TABLE IF NOT EXISTS Waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEEDING PLANS
INSERT INTO Plan (name, price, duration) VALUES
('Free', 0.00, 30),
('Plus', 4.00, 30),
('Business', 8.00, 30)
ON DUPLICATE KEY UPDATE price = VALUES(price);

-- USER PLAN VIEW
CREATE OR REPLACE VIEW user_active_plan AS
SELECT
    u.user_id,
    u.username,
    s.plan_id,
    p.name AS plan_name,
    p.price,
    s.start_date,
    s.end_date
FROM User u
JOIN Subscription s ON u.user_id = s.user_id
JOIN Plan p ON s.plan_id = p.plan_id
WHERE s.is_active = TRUE;

-- EVENT TO DEACTIVATE SUBSCRIPTIONS
DROP EVENT IF EXISTS deactivate_expired_subscriptions;

CREATE EVENT IF NOT EXISTS deactivate_expired_subscriptions
ON SCHEDULE EVERY 1 DAY
DO
  UPDATE Subscription
  SET is_active = FALSE
  WHERE end_date < CURDATE();

SET GLOBAL event_scheduler = ON;

-- USER PRIVILEGES
CREATE USER IF NOT EXISTS 'team_user'@'%' IDENTIFIED BY 'SkWarriors23336';
GRANT ALL PRIVILEGES ON smart_finder.* TO 'team_user'@'%';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS Advertisement (
    ad_id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      BIGINT UNSIGNED NOT NULL,       
    title        VARCHAR(120)  NOT NULL,
    image_url    VARCHAR(255)  NOT NULL,
    link_url     VARCHAR(255),                     
    start_date   DATE         NOT NULL,
    end_date     DATE,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


CREATE TABLE IF NOT EXISTS Wallet (
    user_id     BIGINT UNSIGNED PRIMARY KEY,
    balance     DECIMAL(12,2) NOT NULL DEFAULT 0,           
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
                         ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


CREATE TABLE IF NOT EXISTS WalletTransaction (
    tx_id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    amount      DECIMAL(12,2) NOT NULL,                     
    tx_type     ENUM('deposit','spend','refund') NOT NULL,
    description VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    INDEX(user_id)
);
