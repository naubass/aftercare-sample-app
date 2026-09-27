const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'product_id dan quantity are required' });
  }

  try {
    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product is not found' });
    }

    const product = productResult.rows[0];

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stock is not enough' });
    }

    const orderResult = await pool.query(
      'INSERT INTO orders (product_id, quantity, status) VALUES ($1, $2, $3) RETURNING *',
      [product_id, quantity, 'pending']
    );

    await pool.query(
      'UPDATE products SET stock = stock - $1 WHERE id = $2',
      [quantity, product_id]
    );

    res.status(201).json({ order: orderResult.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error', detail: err.message });
  }
});

module.exports = router;