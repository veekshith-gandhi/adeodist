const { createFeed, editFeed, deletFeed, getFeed, getAllFeed, feedAccess } = require("../controller/feedsController")
const { authenticateToken } = require("../middleware/authentication")

const route = require("express").Router()

route.post("/feed", authenticateToken, createFeed)
route.put("/feed/:id", authenticateToken, editFeed)
route.delete("/feed/:id", authenticateToken, deletFeed)
route.get("/feed/:id", authenticateToken, getFeed)
route.get("/feed", authenticateToken, getAllFeed)
route.post("/feed-access", authenticateToken, feedAccess)


module.exports = route
