import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import pool from '../db.js';

const router = express.Router();

router.get('/levels', authMiddleware, (req, res) => {
  res.json([
    { id: 1, name: 'SQL Injection', difficulty: 'Easy' },
    { id: 2, name: 'XSS Attack', difficulty: 'Medium' },
  ]);
});

// Vulnerable login challenge

router.post('/sql-injection', authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  const userId = req.userId;

  // This is an intentional vulnerable SQL
  const query = `SELECT * FROM fake_users WHERE username = '${username}'`;

  try {
    const result = await pool.query(query);

    let isSuccessful = false;

    if (result.rows.length > 0) {
      isSuccessful = true;
    }

    // Log the attempt 

    await pool.query(
      'INSERT INTO attempts (user_id, challenge_id, submitted_input, is_successful) VALUES ($1, $2, $3, $4)',
      [userId, 1, username, isSuccessful]
    );

    if (isSuccessful) {
      res.json({ message: '🎉 Challenge Completed! SQL Injection was successful' });
    } else {
      res.json({ message: '❌ Try again. Injection failed.' });
    }

  } catch (err) {
    console.error('SQL Injection Challenge Error:', err.message);
  }
});

// Mark challenge as complete
router.post('/complete', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { challengeName } = req.body;

  try {
    // Insert only if not already completed
    await pool.query(
      `
      INSERT INTO user_challenge_progress (user_id, challenge_name)
      VALUES ($1, $2)
      ON CONFLICT (user_id, challenge_name) DO NOTHING
      `,
      [userId, challengeName]
    );

    res.status(200).json({ message: 'Challenge marked as complete.' });
  } catch (err) {
    console.error('Error marking challenge complete:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
