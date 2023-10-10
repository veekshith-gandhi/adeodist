const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, data) => {
        console.log("authdata", data)
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.auth = data;
    })
    next()
}

module.exports = { authenticateToken }