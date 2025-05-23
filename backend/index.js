import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import ctfRoutes from './routes/ctfRoutes.js';
import sqlInjectionRoutes from './routes/sqlInjectionRoutes.js';
import xssRoutes from './routes/xssRoutes.js';
import jwtRoutes from './challenges/jwt/jwtRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins = [
  'https://cybersim.vercel.app',
  'http://localhost:5173',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/challenges', ctfRoutes);
app.use('/api/sql-injection', sqlInjectionRoutes);
app.use('/api/xss', xssRoutes);
app.use('/api/jwt', jwtRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to CyberSim Backend');
});

// Health check route for uptime pings
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});