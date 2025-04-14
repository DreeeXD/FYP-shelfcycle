const Notification = require("../models/notificationModel");

const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, isRead: false }, 
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.error("Mark all notifications error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read",
    });
  }
};

module.exports = markAllNotificationsRead;
