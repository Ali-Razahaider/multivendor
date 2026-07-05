import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Image as ImageIcon, ChevronLeft, MessageSquare } from 'lucide-react'

const DashboardMessages = () => {
  const [conversations, setConversations] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showChat, setShowChat] = useState(false)

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
    setInput('')
  }

  const ConversationList = () => (
    <div className="w-full md:w-[350px] border-r bg-white flex-shrink-0">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <MessageSquare className="h-10 w-10 mb-3" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => { setSelected(c); setShowChat(true) }}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 border-b transition-colors ${selected?._id === c._id ? 'bg-indigo-50' : ''}`}
            >
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0">
                {c.name?.[0] || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm truncate">{c.name}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{c.lastMessageTime}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
              </div>
              {c.unread > 0 && (
                <div className="h-5 w-5 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                  {c.unread}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )

  const ChatPanel = () => {
    if (!selected) {
      return (
        <div className="hidden md:flex flex-1 items-center justify-center text-gray-400">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3" />
            <p className="text-sm">Select a conversation to reply</p>
          </div>
        </div>
      )
    }
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b bg-white">
          <button className="md:hidden" onClick={() => setShowChat(false)}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0">
            {selected.name?.[0] || '?'}
          </div>
          <div>
            <p className="font-medium text-sm">{selected.name}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No messages yet.
            </div>
          ) : (
            messages.map((m) => (
              <div key={m._id || m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${m.sender === 'me' ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md shadow-sm'}`}>
                  <p className="text-sm">{m.text}</p>
                  <p className={`text-xs mt-1 ${m.sender === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>{m.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-white flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <ImageIcon className="h-5 w-5" />
          </button>
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
    )
  }

  return (
    <div className="h-[calc(100vh-80px)] flex border rounded-lg overflow-hidden bg-white shadow-sm">
      <ConversationList />
      <ChatPanel />
    </div>
  )
}

export default DashboardMessages
