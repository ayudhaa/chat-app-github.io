import React, { useState } from "react";

export default function UserSetup({ onSetup }) {
  const [userName, setUserName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() === "") return;
    
    onSetup(userName.trim());
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-blue-600">💬</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Simple Chat
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kamu
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Masukkan nama kamu..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
              autoFocus
              maxLength={20}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {userName.length}/20 karakter
            </p>
          </div>

          <button
            type="submit"
            disabled={userName.trim() === ""}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base shadow-sm"
          >
            Mulai Chatting
          </button>
        </form>
      </div>
    </div>
  );
}