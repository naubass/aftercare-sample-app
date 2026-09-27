require('dotenv').config();
const express = require('express');

const checkoutRoutes = require('./routes/checkout');
const paymentRoutes = require('./routes/payment');
const shippingRoutes = require('./routes/shipping');
const healthRoutes = require('./health');

const app = express();
app.use(express.json());

app.use('/checkout', checkoutRoutes);
app.use('/payment', paymentRoutes);
app.use('/shipping-cost', shippingRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Aftercare sample app is running on port ${PORT}`);
});