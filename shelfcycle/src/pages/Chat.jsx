import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPaperPlane, FaCommentDots } from 'react-icons/fa';
import SummaryAPI from '../common';

const ChatPage = () => {
  const user = useSelector((state) => state?.user?.user);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');

  // ✅ Fetch all users except self
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(SummaryAPI.getUsers.url, {
          method: SummaryAPI.getUsers.method,
          credentials: 'include',
        });
        const data = await res.json();
        const filtered = data.filter((u) => u._id !== user?._id);
        setAllUsers(filtered);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    if (user?._id) fetchUsers();
  }, [user]);

  // ✅ Poll messages for selected user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const res = await fetch(SummaryAPI.getMessages(selectedUser._id), {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  // ✅ Send a message
  const handleSend = async () => {
    if (currentMsg.trim() === '' || !selectedUser) return;

    const newMsg = {
      receiver: selectedUser._id,
      text: currentMsg,
    };

    try {
      const res = await fetch(SummaryAPI.sendMessage.url, {
        method: SummaryAPI.sendMessage.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMsg),
      });

      if (!res.ok) throw new Error('Failed to send message');

      setMessages((prev) => [
        ...prev,
        {
          ...newMsg,
          sender: user._id,
          timestamp: new Date(),
        },
      ]);
      setCurrentMsg('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  //user is not logged in
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Please log in to access chat.</p>
      </div>
    );
  }

  //Main UI
  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-100 rounded-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-50 p-4 border-r border-gray-300">
        <div className="text-xl font-bold text-center mb-4">Chats</div>
        <div className="space-y-3 overflow-y-auto max-h-[80vh]">
          {allUsers.length === 0 && (
            <p className="text-gray-500 text-sm text-center">No users to chat with.</p>
          )}
          {allUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`cursor-pointer p-3 rounded-md shadow-md hover:bg-blue-100 transition ${
                selectedUser?._id === u._id ? 'bg-blue-200' : 'bg-white'
              }`}
            >
              <p className="font-medium text-gray-800">{u.username}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <FaCommentDots className="text-blue-500" size={28} />
        </div>
      </div>

      {/* Chat window */}
      <div className="w-3/4 flex flex-col">
        <div className="bg-gray-800 text-white px-6 py-3 text-lg font-medium">
          {selectedUser ? `${selectedUser.username}` : 'Select a user to start chatting'}
        </div>

        <div className="flex-1 px-6 py-4 bg-gray-200 overflow-y-auto space-y-3">
          {selectedUser && messages.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-4">No messages yet.</p>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-fit max-w-[70%] p-3 rounded-xl shadow-md text-sm ${
                msg.sender === user._id
                  ? 'ml-auto bg-blue-500 text-white'
                  : 'mr-auto bg-white text-gray-800'
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-right text-gray-300 mt-1">
                {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {selectedUser && (
          <div className="bg-gray-800 px-4 py-3">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md focus-within:ring-2 ring-blue-400">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 outline-none text-sm text-gray-700"
                value={currentMsg}
                onChange={(e) => setCurrentMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="ml-3 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
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
