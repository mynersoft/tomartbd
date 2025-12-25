// components/WhatsappChatModal.js
'use client';

import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle, Clock, Check, CheckCheck } from "lucide-react";

export default function WhatsappChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef(null);
  
  // Replace with your WhatsApp number
  const phoneNumber = "+8801868944080";
  
  // Initialize component on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setIsTyping(true);
    
    // Simulate slight delay for better UX
    setTimeout(() => {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      setMessage("");
      setIsTyping(false);
      setIsOpen(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    // Track conversion if needed
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'whatsapp_click', {
        'event_category': 'engagement'
      });
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) return null;

  return (
    <>
      {/* Enhanced Floating Button */}
      <button
        onClick={handleOpen}
        aria-label="Chat on WhatsApp"
        className="fixed bottom-12 right-6 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50 group"
        style={{
          boxShadow: '0 8px 25px rgba(37, 211, 102, 0.3)'
        }}
      >
        <MessageCircle className="h-3 w-3" />
        {/* Pulsing animation */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
        </span>
        {/* Tooltip */}
        <span className="absolute right-14 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
      </button>

      {/* Enhanced Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 md:p-6">
          {/* Backdrop with fade animation */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal with slide-up animation */}
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            {/* WhatsApp-style header */}
            <div className="bg-[#075E54] text-white p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-3 w-3" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#25D366] rounded-full border-2 border-[#075E54]"></span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">WhatsApp Support</h3>
                <div className="flex items-center gap-1 text-xs opacity-90">
                  <CheckCheck className="h-3 w-3" />
                  <span>Typically replies within minutes</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white min-h-[200px]">
              {/* Auto message */}
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-[#075E54] rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                  <p className="text-sm text-gray-700">
                    Hi! 👋 How can we help you today? Send us a message and we'll reply on WhatsApp.
                  </p>
                  <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Just now
                  </span>
                </div>
              </div>

              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                  <span>Opening WhatsApp...</span>
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="border-t p-4 bg-white">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={3}
                  maxLength={1000}
                  placeholder="Type your message here..."
                  className="w-full border border-gray-200 rounded-xl p-3 pr-12 focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 resize-none text-sm transition-all duration-200"
                  aria-label="Message input"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className={`text-xs ${message.length > 900 ? 'text-red-500' : 'text-gray-400'}`}>
                    {message.length}/1000
                  </span>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || isTyping}
                    className={`p-2 rounded-full ${!message.trim() || isTyping 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-[#25D366] hover:bg-[#128C7E]'} 
                      transition-colors duration-200`}
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
              
              {/* Quick Prompts */}
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {["Hello!", "Pricing?", "Schedule demo", "Get support"].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setMessage(prompt)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}