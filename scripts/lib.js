const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SECRET_PATH = path.join(__dirname, '../config/payment-secret.txt');
const SECRET_BACKUP_PATH = path.join(__dirname, '../config/payment-secret.txt.bak');
const HEALTH_URL = 'http://localhost:3000/health';

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

const actions = {
  db: {
    break: () => run('docker stop aftercare-db'),
    fix: () => run('docker start aftercare-db'),
  },
  secret: {
    break: () => {
      if (fs.existsSync(SECRET_PATH)) {
        fs.renameSync(SECRET_PATH, SECRET_BACKUP_PATH);
        console.log('Secret file is hidden');
      } else {
        console.log('Secret file is not available');
      }
    },
    fix: () => {
      if (fs.existsSync(SECRET_BACKUP_PATH)) {
        fs.renameSync(SECRET_BACKUP_PATH, SECRET_PATH);
        console.log('Secret file is has been restored');
      } else {
        console.log('No backup secret file found');
      }
    },
  },
  shipping: {
    break: () => run('docker stop aftercare-mock-shipping-api'),
    fix: () => run('docker start aftercare-mock-shipping-api'),
  },
};

async function checkHealth() {
  try {
    const res = await fetch(HEALTH_URL);
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function verify(field, expected, timeoutMs = 15000, intervalMs = 1000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const health = await checkHealth();

    if (health && health[field] === expected) {
      console.log(`${field} = ${expected} (achieved in ${Date.now() - start}ms)`);
      return true;
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  console.log(`Timeout: ${field} not yet fixed to ${expected} after ${timeoutMs}ms`);
  return false;
}

module.exports = { actions, checkHealth, verify };