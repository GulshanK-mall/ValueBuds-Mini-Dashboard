import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// PostgreSQL connection
const { Pool } = await import('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ValuebudsDB',
});

try {
  const client = await pool.connect();
  client.release();
  console.log('Connected to PostgreSQL database');
} catch (error) {
  console.error('Error connecting to PostgreSQL:', error.message);
  throw error;
}

const schemaPath = join(__dirname, 'schema.postgresql.sql');
const schema = readFileSync(schemaPath, 'utf-8');

const client = await pool.connect();
try {
  await client.query(schema);
} finally {
  client.release();
}

const db = {
  prepare: (query) => {
    let paramIndex = 0;
    let pgQuery = query.replace(/\?/g, () => {
      paramIndex++;
      return `$${paramIndex}`;
    });

    const isInsert = /^INSERT\s+INTO/i.test(query.trim());

    return {
      run: async (...params) => {
        const result = await pool.query(pgQuery, params);
        let lastInsertId = null;
        
        if (isInsert && result.rows.length > 0) {
          lastInsertId = result.rows[0].producer_id || result.rows[0].product_id;
        }
        return {
          lastInsertId: lastInsertId,
          changes: result.rowCount || 0
        };
      },
      get: async (...params) => {
        const result = await pool.query(pgQuery, params);
        return result.rows[0] || null;
      },
      all: async (...params) => {
        const result = await pool.query(pgQuery, params);
        return result.rows;
      }
    };
  },
  exec: async (sql) => {
    await pool.query(sql);
  },
  pragma: (pragma) => {
    if (pragma === 'foreign_keys = ON') {
      // PostgreSQL foreign keys are enabled by default
    }
  },
  pool: pool
};

export default db;
