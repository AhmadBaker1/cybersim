import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import pool from '../db.js';
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Check if user already exists
      const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "User already exists with this email" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into DB
      const newUser = await pool.query(
        "INSERT INTO users (username, email, password_hash, score) VALUES ($1, $2, $3, 0) RETURNING *",
        [username, email, hashedPassword]
      );
  
      res.status(201).json({ message: "Signup successful!", user: newUser.rows[0] });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
router.post('/login', login);
router.get("/profile", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id; // <- This needs to exist!
      const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
      res.json({ user: result.rows[0] });
    } catch (err) {
      console.error("Error in /profile:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


export default router;
