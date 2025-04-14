import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa';
import SummaryAPI from '../common';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, { withCredentials: true });

const ChatPage = () => {
  const user = useSelector((state) => state?.user?.user);
  const [chatUsers, setChatUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef(null);

  const [showSuggestions, setShowSuggestions] = useState(false);


  // Register socket & listen
  useEffect(() => {
    if (user?._id) {
      socket.emit('register_user', user._id);
      fetchChatUsers();
    }

    socket.on('receive_message', (message) => {
      if (message.sender === selectedUser?._id || message.receiver === selectedUser?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [user, selectedUser]);

  // Scroll to latest msg
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatUsers = async () => {
    try {
      const res = await fetch(SummaryAPI.getChatUsers.url, { credentials: 'include' });
      const data = await res.json();
      setChatUsers(data);
    } catch (err) {
      console.error("Failed to fetch chat users", err);
    }
  };

  const fetchMessages = async (partnerId) => {
    try {
      const res = await fetch(SummaryAPI.getMessages(partnerId), { credentials: 'include' });
      const data = await res.json();
      setMessages(data);
      const roomId = generateRoomId(user._id, partnerId);
      socket.emit('join_room', roomId);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleUserClick = (partner) => {
    setSelectedUser(partner);
    fetchMessages(partner._id);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`${SummaryAPI.searchUsers.url}?q=${searchQuery}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("User search failed", err);
    }
  };

  const handleSend = async () => {
    if (!currentMsg.trim() || !selectedUser) return;

    const newMessage = {
      sender: user._id,
      receiver: selectedUser._id,
      text: currentMsg,
      timestamp: new Date(),
    };

    try {
      await fetch(SummaryAPI.sendMessage.url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage),
      });

      const roomId = generateRoomId(user._id, selectedUser._id);
      socket.emit('send_message', { roomId, message: newMessage });

      setMessages((prev) => [...prev, newMessage]);
      setCurrentMsg('');
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  const generateRoomId = (id1, id2) => [id1, id2].sort().join('-');

  if (!user) {
    return <div className="h-screen flex justify-center items-center text-gray-600">Login to chat</div>;
  }

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-100 rounded overflow-hidden shadow-md border">
      {/* Left panel */}
      <div className="w-1/4 bg-white border-r flex flex-col">
      <div className="p-4 border-b relative">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => {
      setSearchQuery(e.target.value);
      if (e.target.value.trim()) handleSearch();
    }}
    onFocus={() => setShowSuggestions(true)}
    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // allow click
    placeholder="Search users..."
    className="w-full px-3 py-2 rounded-md border text-sm"
  />

  {showSuggestions && searchResults.length > 0 && (
    <div className="absolute top-full left-0 right-0 bg-white shadow-lg border mt-1 rounded-md z-50">
      {searchResults.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  handleUserClick(u);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer flex items-center gap-2"
              >
                {u.uploadPic ? (
                  <img src={u.uploadPic} alt="User" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs uppercase">
                    {u.username[0]}
                  </div>
                )}
                <span className="truncate">{u.username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

        <div className="flex-1 overflow-y-auto p-3">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 px-1">Chats</h2>
          {[...searchResults, ...chatUsers].map((u) => (
            <div
              key={u._id}
              onClick={() => handleUserClick(u)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100 ${
                selectedUser?._id === u._id ? 'bg-blue-200' : ''
              }`}
            >
              {u.uploadPic ? (
                <img src={u.uploadPic} alt={u.username} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold uppercase">
                  {u.username[0]}
                </div>
              )}
              <span className="text-sm font-medium text-gray-800 truncate">{u.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat section */}
      <div className="w-3/4 flex flex-col">
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
              <h2 className="text-xl font-bold text-gray-800">{selectedUser.username}</h2>
            </>
          ) : (
            <p className="text-gray-500">Select a user to start chatting</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                  msg.sender === user._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[10px] block text-right mt-1 text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {selectedUser && (
          <div className="p-4 bg-white border-t">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
              <input
                type="text"
                placeholder="Type a message..."
                value={currentMsg}
                onChange={(e) => setCurrentMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
