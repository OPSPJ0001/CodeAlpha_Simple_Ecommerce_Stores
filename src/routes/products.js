const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(row);
});

module.exports = router;
