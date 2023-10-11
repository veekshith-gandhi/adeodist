const db = require("../db");
const jwt = require("jsonwebtoken")

const userLogin = (req, res) => {
    const { name, id } = req.query

    db.get('SELECT * FROM users WHERE name = ? AND id = ?', [name, id], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log("user", user)
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_TOKEN_KEY);
        if (token) {
            return res.status(200).json({ accesstoken: token })
        }
    });
}
module.exports = { userLogin };