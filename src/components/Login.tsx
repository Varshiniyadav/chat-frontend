import { useState } from 'react';
import type { FormEvent } from 'react';
import { useChat } from './ChatContext';

export function Login() {
  const { setCurrentUser } = useChat();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    // Set current user in context
    setCurrentUser(username);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="app-logo">💬</div>
        <h2>Welcome to Chat App</h2>
        <p className="app-subtitle">Connect with friends in real-time</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Choose a username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter your username"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <button type="submit" className="login-button">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
} 