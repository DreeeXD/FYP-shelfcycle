import React, { useState } from 'react';
import { FaPaperPlane, FaCommentDots } from 'react-icons/fa';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');

  const handleSend = () => {
    if (currentMsg.trim() !== '') {
      setMessages([...messages, currentMsg]);
      setCurrentMsg('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-100 shadow-inner rounded-md overflow-hidden">

      {/* Sidebar */}
      <div className="w-1/4 bg-blue-100 flex flex-col justify-between p-4 border-r border-gray-300">
        <div>
          <div className="bg-white text-center text-xl font-semibold py-3 rounded-md shadow border-b-2 border-blue-400">
            Chat
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="bg-white p-3 rounded-full shadow-md hover:scale-105 transition">
            <FaCommentDots size={24} className="text-gray-600" />
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">

        {/* Header with username */}
        <div className="bg-gray-800 text-white px-6 py-3 text-lg font-medium shadow-sm">
          User Name
        </div>

        {/* Messages */}
        <div className="flex-1 px-6 py-4 bg-gray-200 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="bg-white w-fit max-w-[70%] p-3 rounded-xl shadow-md text-gray-800"
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-gray-800 px-4 py-3">
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md focus-within:ring-2 ring-blue-400">
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 outline-none text-sm text-gray-700"
              value={currentMsg}
              onChange={(e) => setCurrentMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button
              onClick={handleSend}
              className="ml-3 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;
