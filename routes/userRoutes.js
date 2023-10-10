const { userRegister, userLogin, getAllUser } = require("../controller/userController")
const { authenticateToken } = require("../middleware/authentication")

const route = require("express").Router()


route.get("/register", userRegister)
route.get("/users", authenticateToken, getAllUser)
route.post("/login", userLogin)

module.exports = route