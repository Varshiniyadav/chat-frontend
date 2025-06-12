import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import socketIOClient from 'socket.io-client';

interface User {
  userId: string;
  socketId: string;
  username: string;
}

interface Message {
  senderId: string;
  message: string;
  sender: string;
  private: boolean;
  timestamp?: Date;
}

interface TypingIndicator {
  isTyping: boolean;
  username: string;
}

interface ChatContextType {
  socket: any;
  messages: Message[];
  activeUsers: User[];
  currentUser: string;
  typingUsers: { [key: string]: boolean };
  setCurrentUser: (username: string) => void;
  sendMessage: (message: string, recipientId: string | null) => void;
  setTyping: (isTyping: boolean, recipientId?: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});

  // Initialize Socket connection
  useEffect(() => {
    // Try to connect to any of the possible server ports
    const possiblePorts = [5000, 5001, 5002, 5003, 5004, 5005];
    let connectedSocket: any = null;
    
    const tryConnect = (portIndex: number) => {
      if (portIndex >= possiblePorts.length) {
        console.error("Could not connect to any server port");
        return;
      }
      
      const port = possiblePorts[portIndex];
      const newSocket = socketIOClient(`http://localhost:${port}`, {
        timeout: 3000,
        reconnectionAttempts: 1
      });
      
      newSocket.on('connect', () => {
        console.log(`Connected to server on port ${port}`);
        connectedSocket = newSocket;
        setSocket(newSocket);
      });
      
      newSocket.on('connect_error', () => {
        console.log(`Failed to connect to port ${port}, trying next port...`);
        newSocket.disconnect();
        tryConnect(portIndex + 1);
      });
    };
    
    tryConnect(0);
    
    return () => {
      if (connectedSocket) {
        connectedSocket.disconnect();
      }
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Receive messages
    socket.on('receive-message', (message: Message) => {
      message.timestamp = new Date();
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Active users update
    socket.on('active-users', (users: User[]) => {
      setActiveUsers(users);
    });

    // Typing indicators
    socket.on('user-typing', (data: TypingIndicator) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.username]: data.isTyping,
      }));
    });

    return () => {
      socket.off('receive-message');
      socket.off('active-users');
      socket.off('user-typing');
    };
  }, [socket]);

  // Register user when username is set
  useEffect(() => {
    if (socket && currentUser) {
      socket.emit('new-user', currentUser);
    }
  }, [socket, currentUser]);

  // Send message function
  const sendMessage = (message: string, recipientId: string | null) => {
    if (socket && message.trim() && currentUser) {
      const newMessage: Message = {
        senderId: socket.id,
        message,
        sender: currentUser,
        private: !!recipientId,
        timestamp: new Date()
      };
      
      // Add to local messages immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Send to server
      socket.emit('send-message', {
        recipientId,
        message,
        sender: currentUser
      });
    }
  };

  // Set typing status
  const setTyping = (isTyping: boolean, recipientId?: string) => {
    if (socket && currentUser) {
      socket.emit('typing', {
        isTyping,
        username: currentUser,
        recipientId
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        socket,
        messages,
        activeUsers,
        currentUser,
        typingUsers,
        setCurrentUser,
        sendMessage,
        setTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 