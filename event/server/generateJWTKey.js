const crypto = require('crypto');

// Generate a random 64-byte key
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('Generated JWT Secret Key:');
console.log(jwtSecret);
console.log('\nCopy this key and paste it in your .env file as:');
console.log(`JWT_SECRET=${jwtSecret}`); 