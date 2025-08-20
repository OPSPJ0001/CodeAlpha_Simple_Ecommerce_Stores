const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  // Validate and compute total
  let total = 0;
  const preparedProduct = db.prepare('SELECT id, price FROM products WHERE id = ?');

  const normalized = items.map(i => {
    const pid = Number(i.productId);
    const qty = Math.max(1, Number(i.quantity || 1));
    const p = preparedProduct.get(pid);
    if (!p) throw new Error(`Invalid product id: ${pid}`);
    const unit_price = Number(p.price);
    const lineTotal = unit_price * qty;
    total += lineTotal;
    return { product_id: pid, quantity: qty, unit_price };
  });

  const insertOrder = db.prepare('INSERT INTO orders (user_id, total) VALUES (?, ?)');
  const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)');

  const tx = db.transaction(() => {
    const info = insertOrder.run(req.user.id, total);
    const orderId = info.lastInsertRowid;
    for (const n of normalized) {
      insertItem.run(orderId, n.product_id, n.quantity, n.unit_price);
    }
    return orderId;
  });

  try {
    const orderId = tx();
    res.json({ orderId, total });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || 'Order failed' });
  }
});

router.get('/mine', auth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
  const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  const result = orders.map(o => ({
    ...o,
    items: itemsStmt.all(o.id)
  }));
  res.json(result);
});

module.exports = router;
