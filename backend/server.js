const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "../Frontend"))); // <-- frontend folder

// Database
const db = new Database("users.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Add user
app.post("/submit", (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname && email && password) {
    db.prepare("INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)")
      .run(fullname, email, password);
    res.json({ status: true });
  }
});

// Get users
app.get("/users", (req, res) => {
  const data = db.prepare("SELECT * FROM users").all();
  res.json(data);
});

// Reset users
app.post("/reset", (req, res) => {
  db.prepare("DELETE FROM users").run();
  res.json({ cleared: true });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
