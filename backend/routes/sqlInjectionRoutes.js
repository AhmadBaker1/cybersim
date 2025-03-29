import express from 'express';
import pool from '../db.js';
const router = express.Router();

// Vulnerable login endpoint 
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // This is an intentional vulnerable SQL query 
    const unsafeQuery = `
    SELECT * FROM sql_challenge_users
    WHERE username = '${username}' AND password = '${password}'
    LIMIT 1;`;

    try {
        const result = await pool.query(unsafeQuery);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // If they logged in as admin we can show the flag 
        if (user.role === 'admin') {
            return res.json({ success: true, role: 'admin', flag: 'FLAG{sql-injection-success}' });
        }

        return res.json({ success: true, role: 'user', message: 'Logged in as user' });
    } catch (err) {
        console.error('SQL Injection Challenge Error:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

export default router;