const { actions } = require('./lib');

const [, , scenario, action] = process.argv;

if (!actions[scenario] || !actions[scenario][action]) {
  console.log('Usage: node scripts/chaos.js <db|secret|shipping> <break|fix>');
  process.exit(1);
}

actions[scenario][action]();