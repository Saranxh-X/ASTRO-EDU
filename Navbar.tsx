import React, { useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  isLoggedIn: boolean;
  username: string;
  isLightMode: boolean;
  toggleLightMode: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  isLoggedIn,
  username,
  isLightMode,
  toggleLightMode,
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };
  return (
    <nav className="navbar au-panel">
      <div className="navbar-left">
        <h1 className="navbar-logo" onClick={() => onNavigate('home')}>ASTRO EDU</h1>
      </div>
      <div className="navbar-right">
        <button 
          className={`nav-tab ${currentScreen === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>

        {!isLoggedIn ? (
          <button 
            className={`nav-tab login-btn ${currentScreen === 'login' ? 'active' : ''}`}
            onClick={() => onNavigate('login')}
          >
            Login
          </button>
        ) : (
          <button className="nav-tab logged-in">
            🟢 {username.toUpperCase()}
          </button>
        )}
        
        <button className="icon-btn theme-toggle" onClick={toggleLightMode} title="Toggle Theme">
          {isLightMode ? '🌙' : '☀️'}
        </button>
        
        <div className="menu-container">
          <button 
            className="icon-btn menu-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Menu"
          >
            ☰
          </button>
          
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => handleMenuClick(() => onNavigate('about'))}>
                About
              </button>
              <button onClick={() => handleMenuClick(() => onNavigate('settings'))}>
                Settings
              </button>
              {isLoggedIn && (
                <>
                  <div className="divider"></div>
                  <button className="logout-btn" onClick={() => handleMenuClick(onLogout)}>
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
