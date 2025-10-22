import React from "react";

export default function ChatWindow({ 
  messages, 
  currentUser, 
  onlineUsers, 
  typingUsers,
  onLogout
}) {
  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">💬</span>
              </div>
              <div>
                <h2 className="text-gray-800 font-semibold text-lg">Simple Chat</h2>
                <p className="text-gray-600 text-sm">
                  Halo, <span className="font-medium text-blue-600">{currentUser}</span>! 
                  • {onlineUsers.length} yang online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {typingUsers.length > 0 && (
            <div className="mt-2 text-sm text-gray-500 italic">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'sedang mengetik' : 'sedang mengetik'}...
            </div>
          )}
        </div>

        <div className="flex-1 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-gray-400">👋</span>
              </div>
              <p className="text-gray-500 text-sm md:text-base max-w-md">
                Ayo kirim pesan pertama kamu dengan user lainnya..
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4 h-full overflow-y-auto pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === currentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.type === "system" ? (
                    <div className="bg-gray-100 text-gray-500 text-center mx-auto px-4 py-2 rounded-full text-xs italic max-w-xs">
                      {msg.message}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] md:max-w-md rounded-xl p-3 shadow-sm ${
                        msg.sender === currentUser
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-700 rounded-bl-none"
                      }`}
                    >
                      {msg.sender !== currentUser && (
                        <div className="text-xs font-semibold text-gray-600 mb-1">
                          {msg.sender}
                        </div>
                      )}
                      <div className={`text-sm md:text-base ${
                        msg.sender === currentUser ? "text-white" : "text-gray-700"
                      }`}>
                        {msg.text}
                      </div>
                      <div className={`text-xs mt-1 ${
                        msg.sender === currentUser ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}