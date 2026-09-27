const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pool = require('./db');

const SECRET_PATH = path.join(__dirname, '../config/payment-secret.txt');

router.get('/', async (req, res) => {
  const health = {
    db: 'fail',
    payment_secret: 'fail',
    shipping_api: 'fail',
  };

  try {
    await pool.query('SELECT 1');
    health.db = 'ok';
  } catch (err) {
    health.db = 'fail';
  }

  health.payment_secret = fs.existsSync(SECRET_PATH) ? 'ok' : 'fail';

  try {
    const response = await fetch(`${process.env.SHIPPING_API_URL}/ongkir`, {
      signal: AbortSignal.timeout(2000),
    });
    health.shipping_api = response.ok ? 'ok' : 'fail';
  } catch (err) {
    health.shipping_api = 'fail';
  }

  const allOk = Object.values(health).every((status) => status === 'ok');
  res.status(allOk ? 200 : 503).json(health);
});

module.exports = router;