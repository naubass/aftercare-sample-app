const { actions, verify } = require('./lib');

const scenarios = [
  { name: 'db', field: 'db' },
  { name: 'secret', field: 'payment_secret' },
  { name: 'shipping', field: 'shipping_api' },
];

async function runScenario({ name, field }) {
  console.log(`[${name}] break`);
  actions[name].break();

  const brokeOk = await verify(field, 'fail');
  if (!brokeOk) {
    console.log(`[${name}] fail in stage break`);
    return false;
  }

  console.log(`[${name}] fix`);
  actions[name].fix();

  const fixedOk = await verify(field, 'ok');
  if (!fixedOk) {
    console.log(`[${name}] recovery fail`);
    return false;
  }

  console.log(`[${name}] success (break + recover)`);
  return true;
}

async function main() {
  const results = await Promise.all(scenarios.map(runScenario));

  const allOk = results.every((r) => r === true);

  if (allOk) {
    console.log('\n🟢 All parallel scenarios is success.');
    process.exit(0);
  } else {
    console.log('\n🔴 There is a scenario that fails when executed in parallel.');
    process.exit(1);
  }
}

main();