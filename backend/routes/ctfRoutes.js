import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import pool from '../db.js';

const router = express.Router();

router.get('/levels', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.name,
        c.description, 
        c.level, 
        c.vulnerability, 
        c.points,
        cc.completed_at
      FROM challenges c
      LEFT JOIN completed_challenges cc 
        ON c.name = cc.challenge_name AND cc.user_id = $1
    `, [userId]);

    const levels = result.rows.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      description: challenge.description,
      level: challenge.level,
      vulnerability: challenge.vulnerability,
      points: challenge.points,
      completed: !!challenge.completed_at,
      completed_at: challenge.completed_at
    }));

    const challenges = result.rows;

    // Determine unlock status
    const response = challenges.map((c, idx) => {
      const isCompleted = !!c.completed_at;

      // First challenge is always unlocked
      if (idx === 0) return { ...c, completed: isCompleted, unlocked: true };

      const prev = challenges[idx - 1];
      const isUnlocked = !!prev.completed_at;

      return { ...c, completed: isCompleted, unlocked: isUnlocked };
    });

    res.json(response);
  } catch (err) {
    console.error("Failed to fetch levels:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Vulnerable login challenge

router.post('/sql-injection', authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  const userId = req.user.id;

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
  const userId = req.user.id
  const { challengeName } = req.body;
  console.log("User marking complete:", userId);

  try {
    // 1. Get challenge details from DB
    const challengeRes = await pool.query(
      'SELECT * FROM challenges WHERE name = $1',
      [challengeName]
    );

    if (challengeRes.rows.length === 0) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const challenge = challengeRes.rows[0];
    const points = challenge.points;

     // 2. Check if already completed
     const completedCheck = await pool.query(
      'SELECT * FROM completed_challenges WHERE user_id = $1 AND challenge_name = $2',
      [userId, challengeName]
    );
    if (completedCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    // 3. Update user score
    await pool.query(
      'UPDATE users SET score = score + $1 WHERE id = $2',
      [challenge.points, userId]
    );

    // 4. Insert into completed_challenges
    await pool.query(
      'INSERT INTO completed_challenges (user_id, challenge_name) VALUES ($1, $2)',
      [userId, challengeName]
    );

    res.json({ message: 'Challenge marked as complete', points: challenge.points });
  } catch (err) {
    console.error('Error marking challenge complete:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
