import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import SummaryAPI from "../common";
import io from "socket.io-client";
import UserSearchDropdown from "../components/UserSearchDropdown";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
});

let typingTimeout;

const ChatPage = () => {
  const { receiverId } = useParams();
  const user = useSelector((state) => state?.user?.user);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [unreadMap, setUnreadMap] = useState({});
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;
    socket.emit("register_user", user._id);
    fetchChatUsers();

    socket.on("receive_message", (message) => {
      const isCurrentChat =
        message.sender === selectedUser?._id ||
        message.receiver === selectedUser?._id;

      if (isCurrentChat) {
        setMessages((prev) => [...prev, message]);
        socket.emit("mark_as_read", {
          senderId: message.sender,
          receiverId: message.receiver,
        });
      } else {
        setUnreadMap((prev) => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1,
        }));
      }

      const otherUserId =
        message.sender === user._id ? message.receiver : message.sender;
      if (!chatUsers.some((u) => u._id === otherUserId)) fetchChatUsers();
    });

    socket.on("typing", () => setPartnerTyping(true));
    socket.on("stop_typing", () => setPartnerTyping(false));
    socket.on("message_read", ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("message_read");
    };
  }, [user, selectedUser]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatUsers = async () => {
    try {
      const res = await fetch(SummaryAPI.getChatUsers.url, {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) setChatUsers(data);
    } catch (err) {
      console.error("Fetch chat users failed", err);
    }
  };

  useEffect(() => {
    if (receiverId && chatUsers.length > 0) {
      const matchedUser = chatUsers.find((u) => u._id === receiverId);
      if (matchedUser) {
        setSelectedUser(matchedUser);
        fetchMessages(receiverId);
      }
    }
  }, [receiverId, chatUsers]);

  const fetchMessages = async (partnerId) => {
    try {
      const res = await fetch(SummaryAPI.getMessages(partnerId), {
        credentials: "include",
      });
      const data = await res.json();
      setMessages(data);
      socket.emit("join_room", generateRoomId(user._id, partnerId));
      socket.emit("mark_all_read", {
        senderId: partnerId,
        receiverId: user._id,
      });
      setUnreadMap((prev) => ({ ...prev, [partnerId]: 0 }));
    } catch (err) {
      console.error("Fetch messages error", err);
    }
  };

  const handleUserSelect = (partner) => {
    setSelectedUser(partner);
    fetchMessages(partner._id);
  };

  const handleSend = async () => {
    if (!currentMsg.trim() || !selectedUser) return;

    const newMessage = {
      sender: user._id,
      receiver: selectedUser._id,
      text: currentMsg,
      timestamp: new Date(),
    };

    setCurrentMsg("");

    try {
      const res = await fetch(SummaryAPI.sendMessage.url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      const savedMsg = await res.json();
      socket.emit("send_message", savedMsg);
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  const handleTyping = (e) => {
    setCurrentMsg(e.target.value);

    socket.emit("typing", {
      roomId: generateRoomId(user._id, selectedUser._id),
    });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", {
        roomId: generateRoomId(user._id, selectedUser._id),
      });
    }, 1000);
  };

  const generateRoomId = (id1, id2) => [id1, id2].sort().join("-");

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Login to chat
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-100 rounded overflow-hidden shadow-md border">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r flex flex-col">
        <UserSearchDropdown onUserSelect={handleUserSelect} />
        <div className="flex-1 overflow-y-auto px-4 pb-3">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Chats</h2>
          {chatUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => handleUserSelect(u)}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100 ${
                selectedUser?._id === u._id ? "bg-blue-200" : ""
              }`}
            >
              {u.uploadPic ? (
                <img
                  src={u.uploadPic}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold uppercase">
                  {u.username[0]}
                </div>
              )}
              <span className="text-sm font-medium text-gray-800 truncate">
                {u.username}
              </span>
              {unreadMap[u._id] > 0 && (
                <div className="absolute right-3 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadMap[u._id]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-white border-b shadow flex items-center gap-3">
          {selectedUser ? (
            <>
              {selectedUser.uploadPic ? (
                <img src={selectedUser.uploadPic} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold uppercase">
                  {selectedUser.username[0]}
                </div>
              )}
              <Link
                to={`/user/${selectedUser._id}`}
                className="text-xl font-bold text-blue-700 hover:underline"
              >
                {selectedUser.username}
              </Link>
            </>
          ) : (
            <p className="text-gray-500">Select a user to start chatting</p>
          )}
        </div>

        {/* Messages */}
        <div ref={chatBoxRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                  msg.sender === user._id ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[10px] block text-right mt-1 text-gray-300">
                  {new Date(msg.timestamp).toLocaleTimeString()}{" "}
                  {msg.sender === user._id && (msg.isRead ? "✓✓" : "✓")}
                </span>
              </div>
            </div>
          ))}
          {partnerTyping && (
            <p className="text-xs text-gray-500 ml-2">Typing...</p>
          )}
        </div>

        {/* Footer */}
        {selectedUser && (
          <div className="p-4 bg-white border-t">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
              <input
                type="text"
                placeholder="Type a message..."
                value={currentMsg}
                onChange={handleTyping}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-transparent outline-none text-sm px-2"
              />
              <button
                onClick={handleSend}
                className="text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-full"
              >
                <FaPaperPlane size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
