import { useState, useEffect, useRef } from 'react';
import { useChat } from './ChatContext';
import { ChatMessage } from './ChatMessage';
import { UserList } from './UserList';
import { ChatInput } from './ChatInput';

export function ChatRoom() {
  const { messages, socket, activeUsers, currentUser } = useChat();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get the selected user's name for header
  const getUsernameFromId = (userId: string | null) => {
    if (!userId) return 'Group Chat';
    const user = activeUsers.find(u => u.socketId === userId);
    return user ? user.username : 'Unknown User';
  };

  // Filter messages based on private/group chat
  const filteredMessages = messages.filter(msg => {
    if (selectedUser) {
      // In private chat, show messages between current user and selected user
      return (
        (msg.senderId === selectedUser && msg.private) ||
        (msg.sender === currentUser && msg.private && 
         activeUsers.find(u => u.socketId === msg.senderId)?.socketId === selectedUser)
      );
    } else {
      // In group chat, show only public messages
      return !msg.private;
    }
  });

  return (
    <div className="chat-room">
      <div className="sidebar">
        <UserList 
          onSelectUser={setSelectedUser}
          selectedUserId={selectedUser}
        />
      </div>
      
      <div className="chat-container">
        <div className="chat-header">
          <h2>{getUsernameFromId(selectedUser)}</h2>
          <div className="chat-status">
            {selectedUser ? 'Private Chat' : 'Group Chat'}
          </div>
        </div>
        
        <div className="messages-container">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg, index) => (
              <ChatMessage
                key={index}
                message={msg.message}
                sender={msg.sender}
                isOwnMessage={msg.sender === currentUser}
                private={msg.private}
                timestamp={msg.timestamp}
              />
            ))
          ) : (
            <div className="empty-chat">
              <div className="empty-chat-icon">💬</div>
              <div className="empty-chat-message">
                {selectedUser 
                  ? "No messages yet. Start a private conversation!" 
                  : "No messages in the group chat. Say hello to everyone!"}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <ChatInput recipientId={selectedUser} />
      </div>
    </div>
  );
} 