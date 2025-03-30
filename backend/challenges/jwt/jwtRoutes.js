import express from 'express';
import { jwtLogin, jwtSecret } from './jwtController.js';

const router = express.Router();

// Login endpoint with JWT
router.post('/login', jwtLogin);
router.get('/secret', jwtSecret);

export default router;
