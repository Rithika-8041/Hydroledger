const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all readings with flat and owner info
router.get("/", (req, res) => {
  const sql = `
    SELECT m.reading_id, m.meter_id, m.reading_date, m.units_consumed,
           f.flat_number, f.owner_name, b.building_name,
           wm.meter_status
    FROM Meter_Reading m
    JOIN Water_Meter wm ON m.meter_id = wm.meter_id
    JOIN Flat f ON wm.flat_id = f.flat_id
    JOIN Building b ON f.building_id = b.building_id
    ORDER BY m.reading_date DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET readings above average (subquery demo)
router.get("/above-avg", (req, res) => {
  const sql = `
    SELECT m.meter_id, m.units_consumed, f.flat_number, f.owner_name
    FROM Meter_Reading m
    JOIN Water_Meter wm ON m.meter_id = wm.meter_id
    JOIN Flat f ON wm.flat_id = f.flat_id
    WHERE m.units_consumed > (SELECT AVG(units_consumed) FROM Meter_Reading)
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new reading — this fires the generate_bill trigger automatically
router.post("/", (req, res) => {
  const { meter_id, units_consumed, reading_date } = req.body;
  const date = reading_date || new Date().toISOString().split("T")[0];
  db.query(
    "INSERT INTO Meter_Reading (meter_id, reading_date, units_consumed) VALUES (?, ?, ?)",
    [meter_id, date, units_consumed],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Reading added. Bill auto-generated via trigger.", id: result.insertId });
    }
  );
});

module.exports = router;
