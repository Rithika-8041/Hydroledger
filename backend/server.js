const express = require("express");
const cors = require("cors");
const db = require("./db");

const buildingsRouter = require("./routes/buildings");
const flatsRouter = require("./routes/flats");
const readingsRouter = require("./routes/readings");
const billsRouter = require("./routes/bills");
const tanksRouter = require("./routes/tanks");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/buildings", buildingsRouter);
app.use("/flats", flatsRouter);
app.use("/readings", readingsRouter);
app.use("/bills", billsRouter);
app.use("/tanks", tanksRouter);

// Dashboard summary
app.get("/dashboard", (req, res) => {
  const queries = {
    buildings: "SELECT COUNT(*) AS count FROM Building",
    flats: "SELECT COUNT(*) AS count FROM Flat",
    totalUnits: "SELECT COALESCE(SUM(units_consumed),0) AS total FROM Meter_Reading",
    pendingBills: "SELECT COUNT(*) AS count FROM Bill WHERE payment_status='Pending'",
    pendingRevenue: "SELECT COALESCE(SUM(total_amount),0) AS total FROM Bill WHERE payment_status='Pending'",
  };

  const results = {};
  const keys = Object.keys(queries);
  let done = 0;

  keys.forEach((key) => {
    db.query(queries[key], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      results[key] = rows[0];
      done++;
      if (done === keys.length) res.json(results);
    });
  });
});

// Usage per building for chart
app.get("/chart/building-usage", (req, res) => {
  const sql = `
    SELECT b.building_name, SUM(m.units_consumed) AS total_usage
    FROM Meter_Reading m
    JOIN Water_Meter wm ON m.meter_id = wm.meter_id
    JOIN Flat f ON wm.flat_id = f.flat_id
    JOIN Building b ON f.building_id = b.building_id
    GROUP BY b.building_name
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Usage per flat for pie chart
app.get("/chart/flat-usage", (req, res) => {
  const sql = `
    SELECT CONCAT(f.flat_number,' (',f.owner_name,')') AS label,
           SUM(m.units_consumed) AS total_usage
    FROM Meter_Reading m
    JOIN Water_Meter wm ON m.meter_id = wm.meter_id
    JOIN Flat f ON wm.flat_id = f.flat_id
    GROUP BY f.flat_id, f.flat_number, f.owner_name
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`HydroLedger API running on http://localhost:${PORT}`));
