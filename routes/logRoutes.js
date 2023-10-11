const { getLogs } = require("../controller/logController")
const { authenticateToken } = require("../middleware/authentication")

const route = require("express").Router()

route.get("/logs", authenticateToken, getLogs)


module.exports = route