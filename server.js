import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const app = express();

app.use(cors());
app.use(express.json());

// POSTGRESQL CONNECTION
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ DB connection error:", err));

// create table
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Table ready");
};

initDB();

// routes
// Health check
app.get("/", (req, res) => {
  res.send("Portfolio backend is running 🚀");
});

// -----------------------
// post: save message
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing fields"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, message]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Database insert failed"
    });
  }
});

// -----------------------
// get: all message
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM contact_messages ORDER BY created_at DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch messages"
    });
  }
});

// -----------------------
// delete: all messages
app.delete("/messages", async (req, res) => {
  try {
    await pool.query("DELETE FROM contact_messages");

    res.json({
      success: true,
      message: "All messages deleted"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete messages"
    });
  }
});

// =======================
// start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});