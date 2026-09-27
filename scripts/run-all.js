const { actions, verify } = require('./lib');

const scenarios = [
  { name: 'db', field: 'db' },
  { name: 'secret', field: 'payment_secret' },
  { name: 'shipping', field: 'shipping_api' },
];

async function runScenario({ name, field }) {
  console.log(`\n=== Scenario: ${name} ===`);

  console.log('-- Break --');
  actions[name].break();
  const brokeOk = await verify(field, 'fail');
  if (!brokeOk) {
    console.log(`Scenario ${name} is failure in stage break, stopped.`);
    return false;
  }

  console.log('-- Fix --');
  actions[name].fix();
  const fixedOk = await verify(field, 'ok');
  if (!fixedOk) {
    console.log(`Scenario ${name} fail recovery, stopped.`);
    return false;
  }

  console.log(`Scenario ${name} success (break + recover).`);
  return true;
}

async function main() {
  for (const scenario of scenarios) {
    const success = await runScenario(scenario);
    if (!success) {
      console.log('\nRun is stopped due to failure.');
      process.exit(1);
    }
  }

  console.log('\n🟢 All scenario is success: break + recover is verified.');
  process.exit(0);
}

main();