import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = ({ onShowLogin }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const handleShowLogin = () => {
    onShowLogin();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Bloggle</h1>
      </div>
      
      <ul className="nav-links">
        <li>
          <a href="/" className="nav-link">Home</a>
        </li>
        <li>
          <a href="/create" className="nav-link">Create</a>
        </li>
        {isAuthenticated && (
          <li>
            <a href="/profile" className="nav-link">Profile</a>
          </li>
        )}
      </ul>

      <div className="nav-auth">
        {isAuthenticated ? (
          <div className="user-menu">
            <button 
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span>{user?.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <span className="username">{user?.username}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      <span>{user?.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="user-details">
                    <span className="username">{user?.username}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <a href="/profile" className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  Profile Settings
                </a>
                <a href="/my-blogs" className="dropdown-item">
                  <span className="dropdown-icon">📝</span>
                  My Blogs
                </a>
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <span className="dropdown-icon">🚪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="auth-btn login-btn" onClick={handleShowLogin}>
              Sign In
            </button>
            <button className="auth-btn signup-btn" onClick={handleShowLogin}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;