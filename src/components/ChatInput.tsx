import { useState, useEffect } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { useChat } from './ChatContext';

interface ChatInputProps {
  recipientId: string | null;
}

export function ChatInput({ recipientId }: ChatInputProps) {
  const { sendMessage, setTyping } = useChat();
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message, recipientId);
      setMessage('');
      
      // Clear typing indicator when message is sent
      setTyping(false, recipientId || undefined);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    setTyping(true, recipientId || undefined);
    
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout - stop typing indicator after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      setTyping(false, recipientId || undefined);
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="chat-input">
      <input
        type="text"
        placeholder={recipientId ? "Type a private message..." : "Type a message to everyone..."}
        value={message}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSendMessage}>
        <span>Send</span>
      </button>
    </div>
  );
} 