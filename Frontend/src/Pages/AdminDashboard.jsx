import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalUsers: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    recentBlogs: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [blogsResponse, usersResponse] = await Promise.all([
          api.get('/api/admin/blogs/stats', { token }),
          api.get('/api/admin/users/stats', { token })
        ]);

        setStats({
          totalBlogs: blogsResponse.totalBlogs || 0,
          totalUsers: usersResponse.totalUsers || 0,
          publishedBlogs: blogsResponse.publishedBlogs || 0,
          draftBlogs: blogsResponse.draftBlogs || 0,
          recentBlogs: blogsResponse.recentBlogs || [],
          recentUsers: usersResponse.recentUsers || []
        });
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminStats();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.username}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.totalBlogs}</h3>
            <p>Total Blogs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.publishedBlogs}</h3>
            <p>Published</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>{stats.draftBlogs}</h3>
            <p>Drafts</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-section">
          <h2>Recent Blogs</h2>
          <div className="recent-list">
            {stats.recentBlogs.length > 0 ? (
              stats.recentBlogs.map(blog => (
                <div key={blog._id} className="recent-item">
                  <div className="item-info">
                    <h4>{blog.title}</h4>
                    <p>By {blog.author?.username} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="item-status">
                    <span className={`status-badge ${blog.status}`}>
                      {blog.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent blogs</p>
            )}
          </div>
        </div>

        <div className="recent-section">
          <h2>Recent Users</h2>
          <div className="recent-list">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map(user => (
                <div key={user._id} className="recent-item">
                  <div className="item-info">
                    <h4>{user.username}</h4>
                    <p>{user.email} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="item-status">
                    <span className="status-badge active">Active</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
