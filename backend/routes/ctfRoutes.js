import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/levels', authMiddleware, (req, res) => {
  res.json([
    { id: 1, name: 'SQL Injection', difficulty: 'Easy' },
    { id: 2, name: 'XSS Attack', difficulty: 'Medium' },
  ]);
});

export default router;
