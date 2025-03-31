import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import pool from '../db.js';
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if user already exists (using username)
    const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const newUser = await pool.query(
      "INSERT INTO users (username, password_hash, score) VALUES ($1, $2, 0) RETURNING *",
      [username, hashedPassword]
    );

    res.status(201).json({ message: "Signup successful!", user: newUser.rows[0] });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
