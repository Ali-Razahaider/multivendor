import { Server } from 'socket.io';
import { allowedOrigins } from '../app.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const parseCookies = (header = '') =>
  Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, ...rest]) => [key, decodeURIComponent(rest.join('='))])
  );

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  // Identify the shopper and/or seller from their session cookies; anonymous
  // sockets are rejected.
  io.use((socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const ids = [];
    const user = cookies.auth_token && verifyToken(cookies.auth_token);
    const shop = cookies.shop_token && verifyToken(cookies.shop_token);
    if (user?.userId) ids.push(String(user.userId));
    if (shop?.shopId) ids.push(String(shop.shopId));
    if (!ids.length) return next(new Error('unauthorized'));
    socket.data.ids = ids;
    next();
  });

  const onlineUsers = new Map();
  const broadcastOnline = () =>
    io.emit(
      'getUsers',
      Array.from(onlineUsers.keys(), (userId) => ({ userId }))
    );

  io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
      if (!socket.data.ids.includes(String(userId))) return;
      onlineUsers.set(String(userId), socket.id);
      broadcastOnline();
    });

    socket.on('sendMessage', ({ senderId, receiverId, text, images } = {}) => {
      if (!socket.data.ids.includes(String(senderId))) return;
      const receiverSocket = onlineUsers.get(String(receiverId));
      if (receiverSocket) {
        io.to(receiverSocket).emit('getMessage', {
          senderId,
          text: String(text ?? '').slice(0, 2000),
          images,
          createdAt: Date.now(),
        });
      }
    });

    socket.on('updateLastMessage', ({ lastMessage, lastMessageId } = {}) => {
      if (!socket.data.ids.includes(String(lastMessageId))) return;
      io.emit('getLastMessage', {
        lastMessage: String(lastMessage ?? '').slice(0, 200),
        lastMessageId,
      });
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) onlineUsers.delete(userId);
      }
      broadcastOnline();
    });
  });

  return io;
};

export default setupSocket;
