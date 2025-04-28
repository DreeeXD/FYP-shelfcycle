const Notification = require("../models/notificationModel");

// GET all notifications for logged-in user
const getUserNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
  };

// CREATE a notification
const createNotification = async (req, res) => {
  try {
    const { recipient, message, link } = req.body;

    const newNotification = new Notification({
      recipient,
      message,
      link,
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Notification created",
      data: newNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating notification",
    });
  }
};

// MARK a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const updated = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notification",
    });
  }
};

module.exports = {
  getUserNotifications,
  createNotification,
  markNotificationAsRead,
};
