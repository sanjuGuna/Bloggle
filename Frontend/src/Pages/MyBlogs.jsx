import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import BlogCard from '../components/BlogCard';

const MyBlogs = () => {
  const { user, token, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      if (!token) return;
      try {
        setLoadingBlogs(true);
        setError(null);
        const data = await api.get('/api/blogs/me', { token });
        setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      } catch (err) {
        console.error('Error fetching my blogs:', err);
        setError(err.message || 'Failed to load your blogs. Please try again.');
      } finally {
        setLoadingBlogs(false);
      }
    };

    if (isAuthenticated && !loading) {
      fetchMyBlogs();
    }
  }, [isAuthenticated, loading, token]);

  if (!isAuthenticated && !loading) {
    return (
      <div className="page-container">
        <h1>My Blogs</h1>
        <p>Please sign in to view your blogs.</p>
      </div>
    );
  }

  if (loading || loadingBlogs) {
    return (
      <div className="page-container">
        <p>Loading your blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>My Blogs</h1>
        <p>{error}</p>
      </div>
    );
  }

  const draftBlogs = blogs.filter((b) => b.status === 'draft');
  const publishedBlogs = blogs.filter((b) => b.status === 'published');

  const handleEdit = (blogId) => {
    if (!blogId) return;
    navigate(`/create?edit=${blogId}`);
  };

  return (
    <div className="page-container">
      <h1>My Blogs</h1>
      <p>Signed in as <strong>{user?.username}</strong></p>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>Drafts ({draftBlogs.length})</h2>
        {draftBlogs.length === 0 ? (
          <p>You have no draft blogs yet.</p>
        ) : (
          <div className="blog-list">
            {draftBlogs.map((blog) => (
              <div key={blog._id} className="my-blog-card-wrapper">
                <BlogCard
                  id={blog._id}
                  publication={blog.publication}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  author={blog.author?.username || user?.username}
                  date={new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                  readTime={blog.readTime}
                  tags={blog.tags}
                  likes={blog.likeCount || blog.likes?.length || 0}
                  comments={blog.commentCount || blog.comments?.length || 0}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(blog._id)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: '#4a6bdf',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>Published ({publishedBlogs.length})</h2>
        {publishedBlogs.length === 0 ? (
          <p>You have not published any blogs yet.</p>
        ) : (
          <div className="blog-list">
            {publishedBlogs.map((blog) => (
              <div key={blog._id} className="my-blog-card-wrapper">
                <BlogCard
                  id={blog._id}
                  publication={blog.publication}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  author={blog.author?.username || user?.username}
                  date={new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                  readTime={blog.readTime}
                  tags={blog.tags}
                  likes={blog.likeCount || blog.likes?.length || 0}
                  comments={blog.commentCount || blog.comments?.length || 0}
                />
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEdit(blog._id)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: '#4a6bdf',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBlogs;
