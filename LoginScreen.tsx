import React, { useState } from 'react';
import './LoginScreen.css';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setIsAuthenticating(true);
      // Simulate network request/authentication scanning
      setTimeout(() => {
        onLogin(username.trim());
      }, 1500);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-panel">
        <h1 className="login-title">SYSTEM LOGIN</h1>
        {isAuthenticating ? (
          <div className="authenticating-container">
            <div className="spinner"></div>
            <p>Scanning ID Card...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">CREWMATE ID (USERNAME)</label>
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Name"
                maxLength={12}
                autoComplete="off"
                required
              />
            </div>

            <div className="input-group" style={{ marginTop: '20px', marginBottom: '10px' }}>
              <label htmlFor="password">PASSCODE (PASSWORD)</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
            </div>
            
            <button type="submit" className="login-button" disabled={!username.trim() || !password.trim()}>
              AUTHENTICATE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginScreen;
