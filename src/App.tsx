import './App.css'
import './components/Chat.css'
import { ChatProvider, useChat } from './components/ChatContext'
import { Login } from './components/Login'
import { ChatRoom } from './components/ChatRoom'

function ChatApp() {
  const { currentUser } = useChat()
  
  return (
    <div className="app">
      {currentUser ? <ChatRoom /> : <Login />}
    </div>
  )
}

function App() {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  )
}

export default App
