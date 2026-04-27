# HydroLedger — Smart Water Monitoring & Billing System

## Project Structure

```
hydroledger/
├── backend/
│   ├── server.js          ← Express entry point
│   ├── db.js              ← MySQL connection
│   ├── package.json
│   └── routes/
│       ├── buildings.js   ← GET/POST buildings
│       ├── flats.js       ← GET/POST flats
│       ├── readings.js    ← GET/POST meter readings (triggers bill)
│       ├── bills.js       ← GET bills, PATCH mark paid
│       └── tanks.js       ← GET tanks, POST refill
│
├── frontend/
│   └── index.html         ← Full dashboard (single file, no framework needed)
│
└── database/
    └── hydroledger.sql    ← Your existing DB schema + seed data
```

---

## Setup Instructions

### Step 1 — Set up the Database
Open MySQL Workbench or terminal and run:
```
source database/hydroledger.sql
```
This creates the HydroLedger database with all tables, triggers, and seed data.

### Step 2 — Configure DB Password
Open `backend/db.js` and update:
```js
password: "",  // ← put your MySQL root password here
```

### Step 3 — Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 4 — Start the Backend
```bash
node server.js
```
You should see:
```
Connected to HydroLedger MySQL database.
HydroLedger API running on http://localhost:5000
```

### Step 5 — Open the Frontend
Just open `frontend/index.html` in your browser.
No server needed for the frontend — it's a plain HTML file.

---

## API Endpoints

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | /dashboard                | Summary stats for dashboard          |
| GET    | /buildings                | All buildings                        |
| GET    | /flats                    | All flats with building name         |
| GET    | /readings                 | All meter readings (joined)          |
| GET    | /readings/above-avg       | Subquery: meters > average usage     |
| POST   | /readings                 | Add reading (trigger fires auto)     |
| GET    | /bills                    | All bills with flat info             |
| PATCH  | /bills/:id/pay            | Mark a bill as paid                  |
| GET    | /tanks                    | All tanks with building info         |
| POST   | /tanks/:id/refill         | Add litres to a tank (transaction)   |
| GET    | /chart/building-usage     | Chart data: usage per building       |
| GET    | /chart/flat-usage         | Chart data: usage per flat           |

---

## Demo Flow (for presentation)

1. Open dashboard → show live stats from DB
2. Go to Meter Readings → show all readings + subquery result
3. Go to Add Reading → submit a new reading → show toast
4. Go to Billing → show auto-generated bill (trigger fired)
5. Click "Mark Paid" → status updates live
6. Go to Tank Monitor → show tank levels + refill form

---

## Tech Stack

- **Frontend**: HTML + CSS + Vanilla JS + Chart.js
- **Backend**: Node.js + Express
- **Database**: MySQL (HydroLedger)
- **Charts**: Chart.js (CDN)
# Hydroledger
