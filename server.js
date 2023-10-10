const express = require('express');
const db = require('./db');
require("dotenv").config();

const userRoute = require("./routes/userRoutes")
const feedRoute = require("./routes/feedsRoutes")
const authRoute = require("./routes/authRoutes")

const app = express()
app.use(express.json())

app.use("/api", userRoute)
app.use("/api", feedRoute)
app.use("/api", authRoute)



const PORT = process.env.PORT || "8080";
//
// db.run("DROP TABLE users")
// db.run("DROP TABLE feed")


db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY UNIQUE, name TEXT, roll TEXT, email TEXT, password TEXT)`);
db.run(`CREATE TABLE IF NOT EXISTS feed (id INTEGER PRIMARY KEY UNIQUE, name TEXT, url TEXT, description TEXT)`);

//INSERT SUPER ADMIN
// db.run(`INSERT INTO users (id, name, roll, email, password) VALUES (1, 'veekshith', 'super-admin', 'veekshith@gmail.com', '12345')`);
// db.run(`INSERT INTO feed (id, name, url, description) VALUES (2, 'veekshih', 'super-admin/ooo', 'veekshith@gmail.com')`);



app.listen(PORT, () => {
    console.log("Listening to PORT", PORT)
})

