const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();
const connectDB = require('./config/Database');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app); // creating server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Socket setup
require("./controller/socket")(io);
global.io = io; // Make socket globally accessible

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use('/api', router);
app.use('/api/notifications', notificationRoutes);

// Database + Server init
connectDB().then(() => {
  server.listen(8081, () => {
    console.log("Connected to MongoDB");
    console.log("Server is running at port 8081");
  });
});
