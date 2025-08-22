import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import "../styles/BlogDetails.css";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [likeLoading, setLikeLoading] = useState(false);

  // Fetch blog data on component mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogData = await api.get(`/api/blogs/${id}`, {
          timeout: 10000,
          retries: 2
        });
        setBlog(blogData);
      } catch (err) {
        console.error('Error fetching blog:', err);
        if (err.status === 404) {
          setError('Blog post not found');
        } else if (err.message?.includes('timed out')) {
          setError('Connection timeout. Please check your internet connection.');
        } else if (err.message?.includes('Network error')) {
          setError('Unable to connect to server. Please try again.');
        } else {
          setError('Failed to load blog post. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageUrls]);
  };

  const handleLike = async () => {
    if (!token) {
      alert('Please login to like this post');
      return;
    }

    try {
      setLikeLoading(true);
      const result = await api.post(`/api/blogs/${id}/like`, {}, { token });
      setBlog(prev => ({
        ...prev,
        likes: result.likes,
        likeCount: result.likeCount
      }));
    } catch (err) {
      console.error('Error liking blog:', err);
      alert('Failed to like post. Please try again.');
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-details">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-details">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-details">
        <div className="error-container">
          <h2>Blog post not found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="blog-details">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="blog-header">
        <h1>{blog.title}</h1>
        <div className="blog-meta">
          <div className="author-info">
            <img
              src={blog.author?.avatar || '/default-avatar.png'}
              alt={blog.author?.username}
              className="author-avatar"
            />
            <div>
              <p className="author-name">By {blog.author?.username}</p>
              <p className="blog-date">{new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>
          <div className="blog-stats">
            <span className="stat">👁️ {blog.views} views</span>
            <span className="stat">⏱️ {blog.readTime}</span>
          </div>
        </div>
      </div>

      {blog.excerpt && (
        <div className="blog-excerpt">
          <p>{blog.excerpt}</p>
        </div>
      )}

      <div className="blog-content">
        <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br>') }} />
      </div>

      {blog.tags && blog.tags.length > 0 && (
        <div className="blog-tags">
          <h4>Tags:</h4>
          <div className="tags-list">
            {blog.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      )}

      <div className="blog-actions">
        <button
          className={`like-btn ${blog.likes?.includes(token) ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          ❤️ {blog.likeCount || 0} {likeLoading ? '...' : ''}
        </button>
        <span className="comments-count">💬 {blog.commentCount || 0} comments</span>
      </div>

      <div className="image-upload-section">
        <h3>Add Related Images</h3>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

        <div className="image-gallery">
          {images.map((src, index) => (
            <img key={index} src={src} alt={`Uploaded ${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
