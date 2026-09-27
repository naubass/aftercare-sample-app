const express = require('express');
const app = express();

app.get('/ongkir', (req, res) => {
  const cost = Math.floor(Math.random() * 20000) + 10000;
  res.json({ courier: 'JNE', service: 'REG', cost });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Mock shipping API jalan di port ${PORT}`);
});