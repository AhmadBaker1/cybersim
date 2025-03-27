import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import ctfRoutes from './routes/ctfRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ctf', ctfRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to CyberSim Backend');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});