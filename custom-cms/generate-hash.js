const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// The 'saltRounds' determines how much time is needed to calculate a single hash.
// 10 is a good, recommended default value for security.
const saltRounds = 10;

function askPassword() {
  return new Promise((resolve) => {
    // This is a trick to hide password input in Node.js CLI
    const onData = (char) => {
      char = char.toString();
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.removeListener('data', onData);
          break;
        default:
          process.stdout.write('\x1B[2K\x1B[200D' + 'Enter your secure password: ' + '*'.repeat(rl.line.length));
          break;
      }
    };
    process.stdin.on('data', onData);

    rl.question('Enter your secure password: ', (password) => {
      resolve(password);
    });
  });
}

async function generateHash() {
  console.log('Generating hash for password...');
  const password = await askPassword();
  
  rl.close();
  process.stdin.pause(); // Stop listening to stdin

  if (!password) {
    console.error('\nPassword cannot be empty.');
    return;
  }

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      console.error('\nError generating hash:', err);
      return;
    }
    console.log('\n\nYour password hash is:');
    console.log(hash);
    console.log('\nCopy this hash and paste it into your .env file as the value for ADMIN_PASSWORD_HASH.');
  });
}

generateHash();
