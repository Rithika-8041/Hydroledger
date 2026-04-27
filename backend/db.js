const mysql = require("mysql2");
require('dotenv').config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "HydroLedger",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to HydroLedger MySQL database.");
});

module.exports = db;
