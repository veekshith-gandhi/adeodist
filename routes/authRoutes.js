const { userLogin } = require("../controller/authController")

const route = require("express").Router()

route.post("/login", userLogin)


module.exports = route
