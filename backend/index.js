import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import pool from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    const time = await pool.query("SELECT NOW()");
    res.json({ message: "Cybersecurity API running", time: time.rows[0] });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

