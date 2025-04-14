const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
} = require("../controller/notificationController");
const markAllNotificationsRead = require("../controller/markNotificationAsRead"); 
const authenticationToken = require("../middleware/authenticationToken");

router.get("/", authenticationToken, getUserNotifications);
router.post("/", authenticationToken, createNotification);
router.patch("/:id", authenticationToken, markNotificationAsRead);


router.put("/mark-all-read", authenticationToken, markAllNotificationsRead);

module.exports = router;
