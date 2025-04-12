const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
} = require("../controller/notificationController");

const authenticateUser = require("../middleware/authenticationToken");

router.get("/", authenticateUser, getUserNotifications);
router.post("/", authenticateUser, createNotification);
router.put("/:id/read", authenticateUser, markNotificationAsRead);

module.exports = router;
