import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import UserSetup from "./components/UserSetup";
import { subscribeToMessages, sendMessage, clearAllMessages } from "./firebase";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sessionStartTime, setSessionStartTime] = useState(null);

  useEffect(() => {
    if (user) {
      const sessionTimer = setTimeout(() => {
        handleAutoLogout();
      }, 24 * 60 * 60 * 1000);

      return () => clearTimeout(sessionTimer);
    }
  }, [user]);

  useEffect(() => {
    const clearMessagesTimer = setInterval(() => {
      if (messages.length > 0) {
        clearAllMessages();
        setMessages([{
          id: Date.now(),
          message: 'Pesan otomatis dibersihkan setelah 24 jam',
          timestamp: new Date(),
          type: 'system'
        }]);
      }
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(clearMessagesTimer);
  }, [messages.length]);
  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToMessages((newMessages) => {
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAutoLogout = () => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      message: 'Sesi berakhir setelah 24 jam, silakan login kembali',
      timestamp: new Date(),
      type: 'system'
    }]);

    setTimeout(() => {
      setUser(null);
      setMessages([]);
      setOnlineUsers([]);
      setSessionStartTime(null);
    }, 2000);
  };

  const handleUserSetup = (userName) => {
    const userInfo = { name: userName };
    setUser(userInfo);
    setSessionStartTime(Date.now());
    sendMessage({
      text: `${userName} bergabung ke chat`,
      sender: 'System',
      timestamp: Date.now(),
      type: 'system'
    });
  };

  const handleSendMessage = async (text) => {
    if (text.trim() === "" || !user) return;
    
    await sendMessage({
      text: text.trim(),
      sender: user.name,
      timestamp: Date.now(),
      type: 'user'
    });
  };

  const handleLogout = () => {
    if (user) {
      sendMessage({
        text: `${user.name} meninggalkan chat`,
        sender: 'System', 
        timestamp: Date.now(),
        type: 'system'
      });
    }
    
    setUser(null);
    setMessages([]);
    setOnlineUsers([]);
    setSessionStartTime(null);
  };

  const getRemainingTime = () => {
    if (!sessionStartTime) return null;
    
    const now = Date.now();
    const elapsed = now - sessionStartTime;
    const oneDay = 24 * 60 * 60 * 1000;
    const remaining = oneDay - elapsed;
    
    if (remaining <= 0) return "00:00:00";
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return <UserSetup onSetup={handleUserSetup} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatWindow 
        messages={messages} 
        currentUser={user.name}
        onlineUsers={onlineUsers}
        onLogout={handleLogout}
        remainingTime={getRemainingTime()}
      />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}