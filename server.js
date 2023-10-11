const express = require('express');
const nodeCron = require('node-cron');
const db = require('./db');
require("dotenv").config();
const fs = require("fs")

const userRoute = require("./routes/userRoutes")
const feedRoute = require("./routes/feedsRoutes")
const authRoute = require("./routes/authRoutes");
const logRoute = require("./routes/logRoutes")
const { createLog, deleteOldLogs } = require('./utils/genericfunction');
const logAPICalls = require('./middleware/apilogs');

const app = express()
app.use(express.json())

app.use("/api", logAPICalls, userRoute)
app.use("/api", logAPICalls, feedRoute)
app.use("/api", logAPICalls, authRoute)
app.use("/api", logRoute)


app.use("/api/access-controll", (req, res) => {
    db.all(`SELECT * FROM AccessControl`, (err, row) => {
        if (err) return res.status(401).json("DB get request failed")
        return res.status(200).json(row)
    });

})


const PORT = process.env.PORT || "8080";
// db.run("DROP TABLE users")
// db.run("DROP TABLE feed")
// db.run("DROP TABLE AccessControl")



db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, role TEXT, email TEXT, password TEXT)`, (err) => {
    console.log(err)
});
db.run(`CREATE TABLE IF NOT EXISTS feed (id INTEGER, name TEXT, url TEXT, description TEXT)`);
db.run('CREATE TABLE IF NOT EXISTS AccessControl (userId INTEGER, feedId INTEGER, canDelete BOOLEAN)');

// Create a Super Admin
db.run(`INSERT INTO users (id, name, role, email, password) VALUES (1, 'veekshith', 'super-admin', 'veekshith@gmail.com', '12345')`);
// stmt.run(superAdmin.id, superAdmin.name, superAdmin.role, superAdmin.email, superAdmin.password);
// stmt.finalize();


// Schedule a cron job to create a new log file every 5 minutes
nodeCron.schedule('*/5 * * * *', () => {
    createLog();
    deleteOldLogs();
});

app.listen(PORT, () => {
    // db.run("DROP TABLE users")
    // db.run("DROP TABLE feed")
    console.log("Listening to PORT", PORT)
})

