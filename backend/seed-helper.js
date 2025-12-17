/**
 * SEED HELPER - Generate Password Hash
 * 
 * Gunakan script ini untuk generate password hash yang benar untuk seed data.
 * Jalankan: node seed-helper.js
 */

const bcrypt = require('bcrypt');

const users = [
  { email: 'admin@demo.com', password: 'Admin123!' },
  { email: 'member@demo.com', password: 'Member123!' }
];

async function generateHashes() {
  console.log('='.repeat(60));
  console.log('GENERATING PASSWORD HASHES FOR SEED DATA');
  console.log('='.repeat(60));
  console.log('');

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Hash: ${hash}`);
    console.log('');
    console.log(`SQL Update:`);
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = '${user.email}';`);
    console.log('');
    console.log('-'.repeat(60));
    console.log('');
  }

  console.log('DONE! Copy hash di atas ke database_seed.sql');
  console.log('Atau jalankan SQL Update langsung ke database.');
}

generateHashes().catch(console.error);
