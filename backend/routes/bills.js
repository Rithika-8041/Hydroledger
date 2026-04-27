const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all bills with flat owner info
router.get("/", (req, res) => {
  const sql = `
    SELECT b.*, f.flat_number, f.owner_name, bl.building_name
    FROM Bill b
    JOIN Flat f ON b.flat_id = f.flat_id
    JOIN Building bl ON f.building_id = bl.building_id
    ORDER BY b.bill_id DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// PATCH — mark bill as paid
router.patch("/:id/pay", (req, res) => {
  db.query(
    "UPDATE Bill SET payment_status='Paid' WHERE bill_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Bill marked as paid" });
    }
  );
});

module.exports = router;
