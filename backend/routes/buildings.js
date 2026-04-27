const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all buildings
router.get("/", (req, res) => {
  db.query("SELECT * FROM Building", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new building
router.post("/", (req, res) => {
  const { building_name, address, total_flats } = req.body;
  db.query(
    "INSERT INTO Building (building_name, address, total_flats) VALUES (?,?,?)",
    [building_name, address, total_flats],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Building added", id: result.insertId });
    }
  );
});

module.exports = router;
