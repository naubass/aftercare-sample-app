const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const shippingApiUrl = process.env.SHIPPING_API_URL;

  try {
    const response = await fetch(`${shippingApiUrl}/ongkir`, {
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      throw new Error(`Shipping API merespon status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(503).json({ error: 'Shipping API cannot be reached', detail: err.message });
  }
});

module.exports = router;