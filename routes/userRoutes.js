const { userLogin, getAllUser, createUser, deletUser, editUser } = require("../controller/userController")
const { authenticateToken } = require("../middleware/authentication")

const route = require("express").Router()

route.post("/user", authenticateToken, createUser)
route.put("/user/:id", authenticateToken, editUser)
route.delete("/user/:id", authenticateToken, deletUser)


route.get("/users", authenticateToken, getAllUser)

module.exports = route
