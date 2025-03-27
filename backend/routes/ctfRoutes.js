import express from 'express';
const router = express.Router();

router.get('/levels', (req, res) => {
  res.json([
    { id: 1, name: 'SQL Injection', difficulty: 'Easy' },
    { id: 2, name: 'XSS Attack', difficulty: 'Medium' },
  ]);
});

export default router;
