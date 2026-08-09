const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database at:', dbPath);
    }
});

const initializeDatabase = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password_hash TEXT
            )
        `, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
                return;
            }
            console.log('Users table initialized.');
            
            const defaultAdminUsername = 'admin';
            const defaultAdminPassword = 'admin123';

            db.get('SELECT * FROM users WHERE username = ?', [defaultAdminUsername], (err, row) => {
                if (err) {
                    console.error('Error checking for default admin user:', err.message);
                    return;
                }
                if (!row) {
                    const hashedPassword = bcrypt.hashSync(defaultAdminPassword, 10);
                    db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', [defaultAdminUsername, hashedPassword], (insertErr) => {
                        if (insertErr) {
                            console.error('Error inserting default admin user:', insertErr.message);
                        } else {
                            console.log('Default admin user created successfully (username: admin, password: admin123).');
                        }
                    });
                } else {
                    console.log('Admin user exists.');
                }
            });
        });
    });
};

initializeDatabase();

module.exports = { db, initializeDatabase };
