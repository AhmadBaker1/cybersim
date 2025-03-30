import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert new user
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password_hash]
    );

    // 4. Generate token
    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
      // 1. Check if user exists by username
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
          return res.status(400).json({ error: 'User not found' });
      }

      // 2. Compare password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid password' });
      }

      // 3. Create JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
      });

      // 4. Return user and token
      res.status(200).json({
          user: {
              id: user.id,
              username: user.username,
              email: user.email,
              score: user.score,
          },
          token,
      });
  } catch (err) {
      console.error('Login Error', err);
      res.status(500).json({ error: 'Login failed' });
  }
};

const getProfile = async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, username, email, score FROM users WHERE id = $1',
        [req.user.id] // from token middleware
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ user: result.rows[0] });
    } catch (err) {
      console.error('Profile Error:', err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  };

export { signup, login, getProfile };
