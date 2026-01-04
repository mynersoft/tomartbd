'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { useSession } from 'next-auth/react';

export default function ChatWindow({ onClose, productId }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const {
    messages,
    rooms,
    activeRoom,
    fetchMessages,
    sendMessage,
    createRoom,
    setActiveRoom,
  } = useChat();
  const { data: session } = useSession();

const id ="6953db3cb3b7f3c22ae8e8d2";
  useEffect(() => {
    if (!activeRoom && productId) {
      // Find or create room for this product
      const room = rooms.find((r) => r.productId === productId);
      if (room) {
        fetchMessages(room.roomId);
      } else {
        createRoom(productId).then((newRoom) => {
          if (newRoom) {
            fetchMessages(newRoom.roomId);
          }
        });
      }
    }
  }, [productId, rooms, activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeRoom) return;

    await sendMessage(message, productId);
    setMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Implement file upload to Cloudinary or your storage
    // Then send message with attachment URL
  };

  if (!id) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="text-gray-500">Please login to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Rooms Sidebar */}
      <div className="flex border-b">
        {rooms.map((room) => (
          <button
            key={room.roomId}
            onClick={() => fetchMessages(room.roomId)}
            className={`flex-1 py-3 px-4 text-sm font-medium ${activeRoom === room.roomId ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            {room.productId ? 'Product Inquiry' : 'General Support'}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Start a conversation with our support team</p>
            <p className="text-sm mt-2">We typically reply within minutes</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.senderModel === 'User' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${msg.senderModel === 'User' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}
              >
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${msg.senderModel === 'User' ? 'text-blue-200' : 'text-gray-500'}`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            onClick={() => document.getElementById('file-input').click()}
          >
            <Paperclip size={20} />
          </button>
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
