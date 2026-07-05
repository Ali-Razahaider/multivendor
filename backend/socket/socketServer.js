import { Server } from 'socket.io'

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'https://multivendor-4bi5.onrender.com'],
      credentials: true,
    },
  })

  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    socket.on('addUser', (userId) => {
      onlineUsers.set(userId, socket.id)
      io.emit('getUsers', Array.from(onlineUsers, ([userId]) => ({ userId })))
    })

    socket.on('sendMessage', ({ senderId, receiverId, text, images }) => {
      const receiverSocket = onlineUsers.get(receiverId)
      if (receiverSocket) {
        io.to(receiverSocket).emit('getMessage', { senderId, text, images, createdAt: Date.now() })
      }
    })

    socket.on('updateLastMessage', ({ lastMessage, lastMessageId }) => {
      io.emit('getLastMessage', { lastMessage, lastMessageId })
    })

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId)
          break
        }
      }
      io.emit('getUsers', Array.from(onlineUsers, ([userId]) => ({ userId })))
    })
  })

  return io
}

export default setupSocket
