const User = require('../models/userModel');
const Message = require('../models/messageModel');

const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find users the current user has messaged or received messages from
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const userIds = new Set();

    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId.toString()) {
        userIds.add(msg.sender.toString());
      }
      if (msg.receiver.toString() !== userId.toString()) {
        userIds.add(msg.receiver.toString());
      }
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('-password');

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Failed to get chat users", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chat users",
    });
  }
};

module.exports = getChatUsers;
