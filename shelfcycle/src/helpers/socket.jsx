import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_DOMAIN || "http://localhost:8081", {
  withCredentials: true,
  autoConnect: false, 
});

export default socket;
