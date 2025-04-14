const Message = require("../models/messageModel");
const Notification = require("../models/notificationModel");

const sendMessage = async (req, res) => {
  const { receiver, text } = req.body;
  const sender = req.user._id;

  try {
    const message = new Message({ sender, receiver, text, read: false });
    await message.save();

    const roomId = [sender, receiver].sort().join("-");
    global.io.to(roomId).emit("receive_message", {
      ...message._doc,
      sender,
      receiver,
    });

    // Create chat notification for receiver
    const notificationData = {
      recipient: receiver,
      message: `You have a new message`,
      link: `/chat/${sender}`,
      isRead: false,
    };

    const savedNotification = await Notification.create(notificationData);

    
    global.io.emit("send_notification", {
      recipientId: receiver.toString(),
      notification: savedNotification,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send Message Error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = sendMessage;
