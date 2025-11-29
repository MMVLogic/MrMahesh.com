const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const initializeDatabase = async () => {
    db.serialize(async () => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table', err.message);
            } else {
                console.log('Users table created or already exists.');
            }
        });

        const defaultAdminUsername = 'admin';
        const defaultAdminPassword = 'password';

        db.get('SELECT * FROM users WHERE username = ?', [defaultAdminUsername], async (err, row) => {
            if (err) {
                console.error('Error checking for default admin user', err.message);
                return;
            }
            if (!row) {
                const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
                db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [defaultAdminUsername, hashedPassword], (err) => {
                    if (err) {
                        console.error('Error inserting default admin user', err.message);
                    } else {
                        console.log('Default admin user created.');
                    }
                });
            } else {
                console.log('Default admin user already exists.');
            }
        });
    });
};

if (require.main === module) {
    initializeDatabase();
}

module.exports = { db, initializeDatabase };
