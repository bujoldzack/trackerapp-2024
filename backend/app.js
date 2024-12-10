const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const path = require('path');
const socket = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'react-build')));

const authRoutes = require('./routes/auth');
app.use('/api/v1/auth', authRoutes);

// deploy
app.use(express.static(path.join(__dirname, 'build')));

readdirSync('./routes').map((route) => {
  if (route !== 'auth.js') app.use('/api/v1', require('./routes/' + route));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'react-build', 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  db();
});

const io = socket(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.msg);
    }
  });
});
