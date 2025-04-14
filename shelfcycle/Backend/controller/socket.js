const connectedUsers = new Map();

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // When a user joins with their userId
    socket.on("register_user", (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    // Join a private chat room
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle sending a message in real-time
    socket.on("send_message", ({ roomId, message }) => {
      socket.to(roomId).emit("receive_message", message);
      console.log(`Message sent in room ${roomId}:`, message);
    });

    // Typing indicator
    socket.on("typing", ({ roomId, sender }) => {
      socket.to(roomId).emit("typing", sender);
    });

    // Real-time notifications (to specific user)
    socket.on("send_notification", ({ recipientId, notification }) => {
      const targetSocket = connectedUsers.get(recipientId);
      if (targetSocket) {
        io.to(targetSocket).emit("new_notification", notification);
        console.log(`Notification sent to user ${recipientId}`);
      }
    });

    // Clean up on disconnect
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      for (let [userId, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
};
