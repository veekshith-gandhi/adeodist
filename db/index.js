// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../sample.db');

module.exports = db;