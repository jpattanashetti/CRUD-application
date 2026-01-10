const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db_name = path.join(__dirname, "users.db");

const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Connected to SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            dob TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            mobile TEXT NOT NULL,
            photo TEXT
        )`);
    }
});

module.exports = db;
