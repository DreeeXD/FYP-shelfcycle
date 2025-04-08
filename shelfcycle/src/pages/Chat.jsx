import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa';
import SummaryAPI from '../common';

const ChatPage = () => {
  const user = useSelector((state) => state?.user?.user);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const chatEndRef = useRef(null);

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
        scrollToBottom();
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!currentMsg.trim() || !selectedUser) return;

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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Please log in to access chat.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50 rounded overflow-hidden shadow-md border">
      <div className="w-1/4 bg-white border-r overflow-y-auto p-4 space-y-3">
        <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">Chats</h2>
        {allUsers.length === 0 ? (
          <p className="text-sm text-gray-500 px-2">No users to chat with.</p>
        ) : (
          allUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition hover:bg-blue-100 ${
                selectedUser?._id === u._id ? 'bg-blue-200' : ''
              }`}
            >
              {u?.uploadPic?.startsWith('data:image') ? (
                <img
                  src={u.uploadPic}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
                  {u.username[0]}
                </div>
              )}
              <span className="text-gray-800 font-medium truncate">{u.username}</span>
            </div>
          ))
        )}
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col">
        <div className="bg-white shadow px-6 py-4 border-b flex items-center gap-3">
          {selectedUser ? (
            <>
              {selectedUser?.uploadPic?.startsWith('data:image') ? (
                <img
                  src={selectedUser.uploadPic}
                  alt={selectedUser.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold uppercase">
                  {selectedUser.username[0]}
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedUser.username}
              </h2>
            </>
          ) : (
            <h2 className="text-lg text-gray-500">Select a user to start chatting</h2>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-100 scroll-smooth">
          {selectedUser && messages.length === 0 && (
            <p className="text-sm text-center text-gray-500">No messages yet.</p>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === user._id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 text-sm max-w-xs shadow ${
                  msg.sender === user._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] mt-1 text-right text-gray-400">
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {selectedUser && (
          <div className="p-4 border-t bg-white">
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
