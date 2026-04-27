-- HydroLedger Full Database Schema
-- Run this file to create and populate the database from scratch

CREATE DATABASE IF NOT EXISTS HydroLedger;
USE HydroLedger;

-- ─────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS Building (
  building_id   INT AUTO_INCREMENT PRIMARY KEY,
  building_name VARCHAR(100) NOT NULL,
  address       VARCHAR(255),
  total_flats   INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Flat (
  flat_id        INT AUTO_INCREMENT PRIMARY KEY,
  building_id    INT NOT NULL,
  flat_number    VARCHAR(20) NOT NULL,
  owner_name     VARCHAR(100),
  floor_no       INT,
  contact_number VARCHAR(20),
  FOREIGN KEY (building_id) REFERENCES Building(building_id)
);

CREATE TABLE IF NOT EXISTS Water_Meter (
  meter_id     INT AUTO_INCREMENT PRIMARY KEY,
  flat_id      INT NOT NULL,
  meter_status ENUM('Active','Inactive') DEFAULT 'Active',
  FOREIGN KEY (flat_id) REFERENCES Flat(flat_id)
);

CREATE TABLE IF NOT EXISTS Meter_Reading (
  reading_id     INT AUTO_INCREMENT PRIMARY KEY,
  meter_id       INT NOT NULL,
  reading_date   DATE NOT NULL,
  units_consumed DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (meter_id) REFERENCES Water_Meter(meter_id)
);

CREATE TABLE IF NOT EXISTS Bill (
  bill_id        INT AUTO_INCREMENT PRIMARY KEY,
  flat_id        INT NOT NULL,
  bill_date      DATE NOT NULL,
  units_consumed DECIMAL(10,2) NOT NULL,
  amount_due     DECIMAL(10,2) NOT NULL,
  payment_status ENUM('Pending','Paid') DEFAULT 'Pending',
  FOREIGN KEY (flat_id) REFERENCES Flat(flat_id)
);

CREATE TABLE IF NOT EXISTS Water_Tank (
  tank_id         INT AUTO_INCREMENT PRIMARY KEY,
  building_id     INT NOT NULL,
  capacity_liters DECIMAL(10,2) NOT NULL,
  current_level   DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (building_id) REFERENCES Building(building_id)
);

-- ─────────────────────────────────────────
-- TRIGGER: Auto-generate bill after a reading
-- ─────────────────────────────────────────

DROP TRIGGER IF EXISTS generate_bill;

DELIMITER $$

CREATE TRIGGER generate_bill
AFTER INSERT ON Meter_Reading
FOR EACH ROW
BEGIN
  DECLARE v_flat_id INT;
  DECLARE v_amount  DECIMAL(10,2);

  -- Lookup flat_id via the meter
  SELECT flat_id INTO v_flat_id
  FROM Water_Meter
  WHERE meter_id = NEW.meter_id;

  -- Rate: ₹5 per unit
  SET v_amount = NEW.units_consumed * 5;

  INSERT INTO Bill (flat_id, bill_date, units_consumed, amount_due, payment_status)
  VALUES (v_flat_id, NEW.reading_date, NEW.units_consumed, v_amount, 'Pending');
END$$

DELIMITER ;

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────

INSERT INTO Building (building_name, address, total_flats) VALUES
  ('Sunrise Apartments', '12 MG Road, Bengaluru', 4),
  ('Green Valley', '45 Park Street, Chennai', 4);

INSERT INTO Flat (building_id, flat_number, owner_name, floor_no, contact_number) VALUES
  (1, 'A101', 'Arjun Sharma',  1, '9876543210'),
  (1, 'A102', 'Priya Nair',    1, '9876543211'),
  (1, 'B201', 'Ravi Kumar',    2, '9876543212'),
  (1, 'B202', 'Meena Iyer',    2, '9876543213'),
  (2, 'C101', 'Suresh Patel',  1, '9876543214'),
  (2, 'C102', 'Anita Desai',   1, '9876543215'),
  (2, 'D201', 'Kiran Rao',     2, '9876543216'),
  (2, 'D202', 'Deepa Menon',   2, '9876543217');

INSERT INTO Water_Meter (flat_id, meter_status) VALUES
  (1, 'Active'),
  (2, 'Active'),
  (3, 'Active'),
  (4, 'Active'),
  (5, 'Active'),
  (6, 'Active'),
  (7, 'Active'),
  (8, 'Active');

INSERT INTO Meter_Reading (meter_id, reading_date, units_consumed) VALUES
  (1, '2026-03-01', 120),
  (2, '2026-03-01',  95),
  (3, '2026-03-01', 210),
  (4, '2026-03-01',  80),
  (5, '2026-03-01', 150),
  (6, '2026-03-01', 175),
  (7, '2026-03-01',  60),
  (8, '2026-03-01', 130);

INSERT INTO Water_Tank (building_id, capacity_liters, current_level) VALUES
  (1, 50000, 32000),
  (2, 40000, 18000);
