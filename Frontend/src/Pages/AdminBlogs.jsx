import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import '../styles/AdminBlogs.css';

const AdminBlogs = () => {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        status: statusFilter !== 'all' ? statusFilter : '',
        search: searchTerm
      });

      const response = await api.get(`/api/admin/blogs?${params}`, { token });
      setBlogs(response.blogs || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      await api.patch(`/api/admin/blogs/${blogId}/status`, 
        { status: newStatus }, 
        { token }
      );
      
      setBlogs(prev => prev.map(blog => 
        blog._id === blogId ? { ...blog, status: newStatus } : blog
      ));
    } catch (err) {
      console.error('Error updating blog status:', err);
      alert('Failed to update blog status');
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await api.delete(`/api/admin/blogs/${blogId}`, { token });
      setBlogs(prev => prev.filter(blog => blog._id !== blogId));
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-blogs">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-blogs">
      <div className="blogs-header">
        <h2>Blog Management</h2>
        <button className="create-blog-btn">
          + Create New Blog
        </button>
      </div>

      <div className="blogs-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchBlogs}>Retry</button>
        </div>
      )}

      <div className="blogs-table-container">
        <table className="blogs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Created</th>
              <th>Views</th>
              <th>Likes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog._id}>
                <td className="title-cell">
                  <div className="blog-title">
                    <h4>{blog.title}</h4>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                  </div>
                </td>
                <td>
                  <div className="author-info">
                    <div className="author-avatar">
                      {blog.author?.avatar ? (
                        <img src={blog.author.avatar} alt={blog.author.username} />
                      ) : (
                        <span>{blog.author?.username?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span>{blog.author?.username}</span>
                  </div>
                </td>
                <td>
                  <select
                    value={blog.status}
                    onChange={(e) => handleStatusChange(blog._id, e.target.value)}
                    className={`status-select ${blog.status}`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </td>
                <td>{formatDate(blog.createdAt)}</td>
                <td>{blog.views || 0}</td>
                <td>{blog.likeCount || 0}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="edit-btn"
                      onClick={() => window.open(`/blog/${blog._id}`, '_blank')}
                    >
                      👁️
                    </button>
                    <button 
                      className="edit-btn"
                      onClick={() => window.open(`/create?edit=${blog._id}`, '_blank')}
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteBlog(blog._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {blogs.length === 0 && (
          <div className="no-blogs">
            <p>No blogs found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
