// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store active users dengan timestamp
const users = new Map(); // socket.id -> { username, joinTime }

// Auto cleanup setiap 1 jam
setInterval(() => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // 1 hari dalam milliseconds
  
  users.forEach((userData, socketId) => {
    if (now - userData.joinTime > oneDay) {
      // User sudah lebih dari 1 hari, disconnect
      const socket = io.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect();
      }
    }
  });
}, 60 * 60 * 1000); // Check setiap 1 jam

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to chat
  socket.on('user_join', (username) => {
    // Store user info dengan timestamp
    users.set(socket.id, { 
      username, 
      joinTime: Date.now() 
    });
    
    // Notify all users about new user
    socket.broadcast.emit('user_joined', {
      username,
      message: `${username} bergabung ke chat`,
      timestamp: new Date(),
      type: 'system'
    });

    // Send current online users to the new user
    const onlineUsers = Array.from(users.values()).map(user => user.username);
    socket.emit('online_users', onlineUsers);
    
    // Update all users about online users
    io.emit('online_users', onlineUsers);
  });

  // Handle new message
  socket.on('send_message', (data) => {
    const userData = users.get(socket.id);
    if (userData) {
      const messageData = {
        id: Date.now(),
        text: data.text,
        sender: userData.username,
        timestamp: new Date(),
        type: 'user'
      };

      // Send to all users including sender
      io.emit('receive_message', messageData);
    }
  });

  // Handle user typing
  socket.on('typing_start', () => {
    const userData = users.get(socket.id);
    if (userData) {
      socket.broadcast.emit('user_typing', userData.username);
    }
  });

  socket.on('typing_stop', () => {
    const userData = users.get(socket.id);
    if (userData) {
      socket.broadcast.emit('user_stop_typing', userData.username);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const userData = users.get(socket.id);
    if (userData) {
      // Remove user
      users.delete(socket.id);

      // Notify all users
      socket.broadcast.emit('user_left', {
        username: userData.username,
        message: `${userData.username} meninggalkan chat`,
        timestamp: new Date(),
        type: 'system'
      });

      // Update online users
      const onlineUsers = Array.from(users.values()).map(user => user.username);
      io.emit('online_users', onlineUsers);
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});