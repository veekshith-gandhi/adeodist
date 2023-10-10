const { userLogin, getAllUser, createUser, deletUser, editUser } = require("../controller/userController")
const { authenticateToken } = require("../middleware/authentication")

const route = require("express").Router()

route.post("/user", createUser)
route.put("/user/:id", editUser)
route.delete("/user/:id", deletUser)


route.get("/users", authenticateToken, getAllUser)
route.post("/login", userLogin)

module.exports = route
