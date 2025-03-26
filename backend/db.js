import pkg from 'pg';
import dontenv from 'dontenv';
dontenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
});

export default pool;