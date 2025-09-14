import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLayout.css';

const AdminLayout = ({ children, currentPage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
    { id: 'blogs', label: 'Blogs', icon: '📝', path: '/admin/blogs' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'categories', label: 'Categories', icon: '🏷️', path: '/admin/categories' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Close sidebar when switching to desktop view
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Bloggle Admin</h2>
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
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
              <span className="user-role">Admin</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <button 
            className="mobile-menu-btn"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <div className="header-title">
            <h1>{menuItems.find(item => item.id === currentPage)?.label || 'Admin'}</h1>
          </div>
          <div className="header-actions">
            <button 
              className="back-to-site-btn"
              onClick={() => navigate('/')}
            >
              ← Back to Site
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;