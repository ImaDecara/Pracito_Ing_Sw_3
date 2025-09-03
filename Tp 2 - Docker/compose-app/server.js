const express = require('express');
const { Pool } = require('pg');

const app = express();

// Variables de entorno
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL || '';

// Conexión a PostgreSQL (solo si está configurado)
let pool = null;
if (DATABASE_URL) {
  pool = new Pool({ connectionString: DATABASE_URL });
}

app.get('/', (_req, res) => {
  res.json({ ok: true, env: NODE_ENV, ts: new Date().toISOString() });
});

app.get('/health', async (_req, res) => {
  if (!pool) return res.json({ status: 'ok', db: 'not-configured' });
  try {
    const r = await pool.query('SELECT 1 as alive');
    res.json({ status: 'ok', db: 'connected', check: r.rows[0] });
  } catch (e) {
    res.status(500).json({ status: 'degraded', db: 'error', error: e.message });
  }
});

app.get('/items', async (_req, res) => {
  if (!pool) return res.status(503).json({ error: 'DB not configured' });
  try {
    const r = await pool.query('SELECT id, name FROM items ORDER BY id');
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT} (env=${NODE_ENV})`);
});
