const db = require("../db")
const jwt = require('jsonwebtoken');

const createUser = (req, res) => {

    const authenticatedUser = req.auth;
    console.log("authenticatedUser", authenticatedUser)
    if (authenticatedUser.roll !== 'super-admin') {
        return res.status(403).json({ error: 'Access denied. Only super-admin can create users.' });
    }

    const { id, name, email, password, roll } = req.query
    if (id && name && email && password && roll) {
        db.run(`INSERT INTO users (id,name, roll, email, password) VALUES (?,?,?,?,?)`, [id, name, roll, email, password], (err) => {
            if (err) return res.status(401).json({ msg: "DB insert failed", err: err })
            return res.status(200).json({ msg: "DB insert Success", UserId: id })
        });
    } else {
        return res.status(400).json("Please provide all the fields")
    }
}

const editUser = (req, res) => {
    const authenticatedUser = req.auth;
    if (authenticatedUser.role !== 'super-admin') {
        return res.status(403).json({ error: 'Access denied. Only super-admin can create users.' });
    }

    // Extract user ID from the route parameters
    const userId = req.params.id;
    console.log(userId)
    const { name, email, password, roll } = req.query

    if (userId && name && email && password && roll) {
        db.run(`UPDATE users SET name=?, email=?, password=?, roll=? WHERE id=?`, [name, email, password, roll, userId], (err) => {
            if (err) return res.status(501).json({ msg: "DB insert failed", err: err })
            return res.status(201).json("DB Edit Success")
        });
    } else {
        return res.status(400).json("Please provide all the fields")
    }
}


const deletUser = (req, res) => {
    const authenticatedUser = req.auth;
    if (authenticatedUser.role !== 'super-admin') {
        return res.status(403).json({ error: 'Access denied. Only super-admin can create users.' });
    }

    // Extract user ID from the route parameters
    const userId = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete user' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
}

const getAllUser = (req, res) => {
    console.log(req.user)
    db.all(`SELECT * FROM users`, (err, row) => {
        if (err) return res.status(401).json("DB get request failed")
        return res.status(200).json(row)
    });
}



module.exports = { createUser, getAllUser, editUser, deletUser }