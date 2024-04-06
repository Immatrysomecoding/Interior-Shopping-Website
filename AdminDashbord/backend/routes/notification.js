const notification = require("../controllers/notification");
const router = require("express").Router();

router.get("/notification", notification.getAllNotification);
module.exports = router;