import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Vulnerable login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const unsafeQuery = `
    SELECT * FROM sql_challenge_users
    WHERE username = '${username}' AND password = '${password}'
    LIMIT 1;`;

  // Simulated query for frontend feedback
  const simulatedQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // 💥 Detect SQL Injection (for fake simulation)
  const injectionRegex = /('|--|\bOR\b|\b1=1\b)/i;
  const bypassDetected = injectionRegex.test(username) || injectionRegex.test(password);

  // Simulate bypass with injected input (before actual DB query)
  if (bypassDetected) {
    return res.json({
      success: true,
      role: "admin",
      flag: "FLAG{sql_bypass_master}",
      query: simulatedQuery,
    });
  }

  try {
    const result = await pool.query(unsafeQuery);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        query: simulatedQuery, // still return simulated query
      });
    }

    // Return flag if admin logs in
    if (user.role === 'admin') {
      return res.json({
        success: true,
        role: "admin",
        flag: "FLAG{sql-injection-success}",
        query: simulatedQuery,
      });
    }

    // Normal user login
    return res.json({
      success: true,
      role: "user",
      message: "Logged in as user",
      query: simulatedQuery,
    });
  } catch (err) {
    console.error("SQL Injection Challenge Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      query: simulatedQuery, // include query even on error
    });
  }
});

export default router;
