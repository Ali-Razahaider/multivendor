import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Image as ImageIcon, ChevronLeft, MessageSquare } from 'lucide-react'
import axios from 'axios'
import { io } from 'socket.io-client'
import server from '../server'
import { format } from '../utils/timeago'

const ENDPOINT = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

const UserInbox = () => {
  const { user } = useSelector((state) => state.user)
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [participants, setParticipants] = useState({})
  const socketRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(ENDPOINT, { transports: ['websocket'] })
    socketRef.current.on('getMessage', (data) => {
      setArrivalMessage({ sender: data.senderId, text: data.text, createdAt: Date.now() })
    })
    socketRef.current.on('getUsers', setOnlineUsers)
    return () => socketRef.current.disconnect()
  }, [])

  useEffect(() => {
    if (user) socketRef.current.emit('addUser', user._id)
  }, [user])

  useEffect(() => {
    if (arrivalMessage && selected?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage])
    }
  }, [arrivalMessage, selected])

  useEffect(() => {
    if (!user?._id) return
    ;(async () => {
      try {
        const { data } = await axios.get(
          `${server}conversation/get-all-conversation-user/${user._id}`,
          { withCredentials: true }
        )
        setConversations(data.conversations)
        const ids = [...new Set(data.conversations.map((c) => c.members.find((m) => m !== user._id)).filter(Boolean))]
        const info = {}
        await Promise.all(ids.map(async (id) => {
          try {
            const { data: shopData } = await axios.get(`${server}shop/get-shop-info/${id}`)
            info[id] = shopData.shop
          } catch {}
        }))
        setParticipants((prev) => ({ ...prev, ...info }))
      } catch (err) {
        console.error(err?.response?.data || err.message)
      }
    })()
  }, [user, messages])

  useEffect(() => {
    if (!selected?._id) return
    ;(async () => {
      try {
        const { data } = await axios.get(`${server}message/get-all-messages/${selected._id}`)
        setMessages(data.messages)
      } catch (err) {
        console.error(err?.response?.data || err.message)
      }
    })()
  }, [selected])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getParticipant = useCallback((chat) => {
    const id = chat?.members?.find((m) => m !== user?._id)
    return participants[id] || null
  }, [user?._id, participants])

  const getAvatarUrl = (p) => {
    if (!p) return null
    return typeof p.avatar === 'string' ? p.avatar : p.avatar?.url || null
  }

  const onlineCheck = useCallback((chat) => {
    const member = chat.members.find((m) => m !== user?._id)
    return onlineUsers.some((u) => u.userId === member)
  }, [user?._id, onlineUsers])

  const sendMessage = async () => {
    if (!input.trim() || !selected) return
    const receiverId = selected.members.find((m) => m !== user._id)
    socketRef.current.emit('sendMessage', { senderId: user._id, receiverId, text: input })
    try {
      const { data } = await axios.post(`${server}message/create-new-message`, {
        sender: user._id, text: input, conversationId: selected._id,
      })
      setMessages((prev) => [...prev, data.message])
      await axios.put(`${server}conversation/update-last-message/${selected._id}`, {
        lastMessage: input, lastMessageId: user._id,
      })
      setInput('')
    } catch {}
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !selected) return
    const receiverId = selected.members.find((m) => m !== user._id)
    socketRef.current.emit('sendMessage', { senderId: user._id, receiverId, images: '' })
    const reader = new FileReader()
    reader.onload = async () => {
      if (reader.readyState === 2) {
        try {
          const { data } = await axios.post(`${server}message/create-new-message`, {
            images: reader.result,
            sender: user._id,
            text: '',
            conversationId: selected._id,
          })
          setMessages((prev) => [...prev, data.message])
          await axios.put(`${server}conversation/update-last-message/${selected._id}`, {
            lastMessage: 'Photo', lastMessageId: user._id,
          })
        } catch {}
      }
    }
    reader.readAsDataURL(file)
  }

  const selectConversation = (c) => {
    setSelected(c)
    setShowChat(true)
  }

  const p = getParticipant(selected)
  const avatar = getAvatarUrl(p)

  return (
    <div className="h-screen flex">
      <div className={`md:flex w-full ${showChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Conversation List */}
        <div className="w-full md:w-[350px] border-r bg-white flex-shrink-0">
          <div className="p-4 border-b"><h2 className="text-lg font-semibold">Messages</h2></div>
          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <MessageSquare className="h-10 w-10 mb-3" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : conversations.map((c) => {
              const cp = getParticipant(c)
              const cavatar = getAvatarUrl(cp)
              return (
                <div
                  key={c._id}
                  onClick={() => selectConversation(c)}
                  className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${selected?._id === c._id ? 'bg-indigo-50' : ''}`}
                >
                  <div className="h-10 w-10 rounded-full flex-shrink-0 overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {cavatar ? <img src={cavatar} alt="" className="w-full h-full object-cover" /> : cp?.name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm truncate">{cp?.name || 'Shop'}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0">{c.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                  </div>
                  {onlineCheck(c) && <div className="h-2 w-2 rounded-full bg-green-400 flex-shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat Panel */}
        {!selected ? (
          <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3" />
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b bg-white">
              <button className="md:hidden" onClick={() => setShowChat(false)}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="h-9 w-9 rounded-full flex-shrink-0 overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : p?.name?.[0] || '?'}
              </div>
              <div><p className="font-medium text-sm">{p?.name || 'Shop'}</p></div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: 'calc(100vh - 260px)' }}>
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">No messages yet. Start a conversation!</div>
              ) : messages.map((m) => (
                <div key={m._id} ref={scrollRef} className={`flex ${m.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${m.sender === user._id ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md shadow-sm'}`}>
                    {m.images?.url && <img src={m.images.url} className="w-[200px] h-[200px] object-cover rounded-lg mb-2" alt="" />}
                    {m.text && <p className="text-sm">{m.text}</p>}
                    <p className={`text-xs mt-1 ${m.sender === user._id ? 'text-indigo-200' : 'text-gray-400'}`}>{format(m.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-white flex items-center gap-2">
              <label className="p-2 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer">
                <ImageIcon className="h-5 w-5" />
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
              </label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button size="icon" onClick={sendMessage} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInbox
