// components/WhatsappChatModal.js
import { useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";

export default function WhatsappChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Replace with your WhatsApp number
  const phoneNumber = "1234567890";

  const handleSend = () => {
    if (!message.trim()) return;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform transform hover:scale-110 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/40">
          <div className="bg-white w-full max-w-sm rounded-t-xl shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Chat with us</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages / Input */}
            <div className="p-4 flex flex-col gap-3">
              <p className="text-gray-600 text-sm">
                Type your message below and we’ll reply on WhatsApp!
              </p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Write a message..."
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              />
              <button
                onClick={handleSend}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
              >
                Send <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}