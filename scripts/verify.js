const { verify } = require('./lib');

const [, , field, expected] = process.argv;

if (!field || !expected) {
  console.log('Usage: node scripts/verify.js <db|payment_secret|shipping_api> <ok|fail>');
  process.exit(1);
}

verify(field, expected).then((success) => {
  process.exit(success ? 0 : 1);
});