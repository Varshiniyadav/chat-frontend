
import { useChat } from './ChatContext';

interface UserListProps {
  onSelectUser: (userId: string | null) => void;
  selectedUserId: string | null;
}

export function UserList({ onSelectUser, selectedUserId }: UserListProps) {
  const { activeUsers, currentUser, typingUsers } = useChat();
  
  const handleSelectUser = (userId: string) => {
    if (selectedUserId === userId) {
      // If already selected, deselect (go to group chat)
      onSelectUser(null);
    } else {
      onSelectUser(userId);
    }
  };

  return (
    <div className="user-list">
      <h3>Active Users ({activeUsers.length})</h3>
      
      <div className={`user-option group-chat ${selectedUserId === null ? 'active' : ''}`} 
           onClick={() => onSelectUser(null)}>
        <div className="user-avatar">
          <i className="fa fa-users"></i>
        </div>
        <div className="user-info">
          <div className="user-name">Group Chat</div>
        </div>
        <div className={`user-selection ${selectedUserId === null ? 'selected' : ''}`} />
      </div>
      
      <div className="users">
        {activeUsers
          .filter(user => user.username !== currentUser)
          .map(user => (
            <div 
              key={user.socketId} 
              className={`user-option ${selectedUserId === user.socketId ? 'active' : ''}`}
              onClick={() => handleSelectUser(user.socketId)}
            >
              <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                {typingUsers[user.username] && (
                  <div className="typing-indicator">typing...</div>
                )}
              </div>
              <div className={`user-selection ${selectedUserId === user.socketId ? 'selected' : ''}`} />
            </div>
          ))}
      </div>
    </div>
  );
} 