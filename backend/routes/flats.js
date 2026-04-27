const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all flats with building name
router.get("/", (req, res) => {
  const sql = `
    SELECT f.*, b.building_name
    FROM Flat f
    JOIN Building b ON f.building_id = b.building_id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new flat
router.post("/", (req, res) => {
  const { building_id, flat_number, owner_name, floor_no, contact_number } = req.body;
  db.query(
    "INSERT INTO Flat (building_id, flat_number, owner_name, floor_no, contact_number) VALUES (?,?,?,?,?)",
    [building_id, flat_number, owner_name, floor_no, contact_number],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Flat added", id: result.insertId });
    }
  );
});

module.exports = router;
