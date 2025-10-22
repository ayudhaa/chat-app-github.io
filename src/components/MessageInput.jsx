import React, { useState, useRef, useEffect } from "react";

export default function MessageInput({ onSend, onTypingStart, onTypingStop }) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
    handleTypingStop();
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (isTyping) {
      setIsTyping(false);
      onTypingStop();
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className={`${text.trim() ? 'flex-1' : 'w-full'} lg:flex-1`}>
            <input
              type="text"
              placeholder="Ketik pesan kamu..."
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
            />
          </div>
          
          {text.trim() && (
            <button
              onClick={handleSend}
              className="lg:hidden bg-blue-500 text-white w-12 h-12 rounded-full hover:bg-blue-600 transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}