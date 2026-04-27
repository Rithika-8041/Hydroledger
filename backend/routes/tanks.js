const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all tanks with building info
router.get("/", (req, res) => {
  const sql = `
    SELECT t.*, b.building_name
    FROM Water_Tank t
    JOIN Building b ON t.building_id = b.building_id
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST tanker refill (uses transaction + savepoint internally)
router.post("/:id/refill", (req, res) => {
  const { liters } = req.body;
  const tankId = req.params.id;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      "UPDATE Water_Tank SET current_level = LEAST(current_level + ?, capacity_liters) WHERE tank_id = ?",
      [liters, tankId],
      (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: err.message }));
        }
        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
          res.json({ message: `Tank ${tankId} refilled with ${liters}L` });
        });
      }
    );
  });
});

module.exports = router;
