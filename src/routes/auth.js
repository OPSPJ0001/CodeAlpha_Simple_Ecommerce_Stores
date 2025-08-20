const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_change_me';
const SALT_ROUNDS = 10;

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, password_hash);
    const user = { id: info.lastInsertRowid, name, email };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!row) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const user = { id: row.id, name: row.name, email: row.email };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
