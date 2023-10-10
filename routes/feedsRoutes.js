const { createFeed, editFeed, deletFeed, getFeed, getAllFeed } = require("../controller/feedsController")
const { authenticateToken } = require("../middleware/authentication")

const route = require("express").Router()

route.post("/feed", createFeed)
route.put("/feed/:id", editFeed)
route.delete("/feed/:id", deletFeed)
route.get("/feed/:id", getFeed)
route.get("/feed", getAllFeed)



module.exports = route
