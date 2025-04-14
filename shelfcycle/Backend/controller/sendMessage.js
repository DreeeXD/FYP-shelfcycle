const Message = require("../models/messageModel");

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

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = sendMessage;
