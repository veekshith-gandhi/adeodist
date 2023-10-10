const db = require("../db")
const jwt = require('jsonwebtoken');

const userRegister = (req, res) => {
    const { id, name, email, password, roll } = req.query
    if (id && name && email && password && roll) {
        db.run(`INSERT INTO users (id,name, roll, email, password) VALUES (?,?,?,?,?)`, [id, name, roll, email, password], (err) => {
            if (err) return res.status(401).json("DB insert failed")
            return res.status(200).json("DB insert Success")
        });
    } else {
        return res.status(400).json("Please provide all the fields")
    }
}

const userLogin = (req, res) => {
    const { name } = req.query
    const username = { name: name }
    const accesstoken = jwt.sign(username, process.env.ACCESS_TOKEN_KEY)
    if (accesstoken) {
        return res.status(200).json({ accesstoken: accesstoken })
    }
}

const getAllUser = (req, res) => {
    console.log(req.user)
    db.all(`SELECT * FROM users`, (err, row) => {
        if (err) return res.status(401).json("DB get request failed")
        return res.status(200).json(row)
    });
}


module.exports = { userRegister, getAllUser, userLogin }