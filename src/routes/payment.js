const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const SECRET_PATH = path.join(__dirname, '../../config/payment-secret.txt');

router.post('/', (req, res) => {
  let secretKey;
  try {
    secretKey = fs.readFileSync(SECRET_PATH, 'utf-8').trim();
  } catch (err) {
    return res.status(500).json({ error: 'Payment secret key is not found' });
  }

  const { order_id, amount } = req.body;

  if (!order_id || !amount) {
    return res.status(400).json({ error: 'order_id dan amount are required' });
  }

  res.status(200).json({
    payment_id: `pay_${Date.now()}`,
    order_id,
    amount,
    status: 'success',
  });
});

module.exports = router;