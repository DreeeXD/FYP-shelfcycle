const Message = require('../models/messageModel');
const User = require('../models/userModel');

const getChatUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const userIds = new Set();

    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId.toString()) userIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId.toString()) userIds.add(msg.receiver.toString());
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error("Failed to fetch chat users:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = getChatUsers;
