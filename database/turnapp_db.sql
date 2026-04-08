CREATE DATABASE turnapp;
USE turnapp;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'admin') DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  available BOOLEAN DEFAULT true
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  slot_id INT NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (slot_id) REFERENCES slots(id)
);

USE turnapp;
INSERT INTO users (name, email, password, role) VALUES (
  'Admin',
  'admin@turnapp.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);