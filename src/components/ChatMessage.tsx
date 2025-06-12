import { useChat } from './ChatContext';

interface ChatMessageProps {
  message: string;
  sender: string;
  isOwnMessage: boolean;
  private: boolean;
  timestamp?: Date;
}

export function ChatMessage({ message, sender, isOwnMessage, private: isPrivate, timestamp }: ChatMessageProps) {
  const formattedTime = timestamp 
    ? new Intl.DateTimeFormat('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }).format(timestamp) 
    : '';
  
  return (
    <div className={`message-container ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      <div className="message-bubble">
        {!isOwnMessage && <div className="message-sender">{sender}</div>}
        <div className="message-content">
          {message}
          {isPrivate && <span className="private-indicator">(private)</span>}
        </div>
        <div className="message-timestamp">{formattedTime}</div>
      </div>
    </div>
  );
} 