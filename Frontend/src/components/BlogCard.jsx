import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BlogCard.css";

const BlogCard = ({ 
  id, 
  title, 
  excerpt, 
  author, 
  date, 
  publication, 
  readTime, 
  tags, 
  likes, 
  comments 
}) => {
  const navigate = useNavigate();

  // Generate a default id if none is provided
  const blogId = id || Math.random().toString(36).substr(2, 9);

  return (
    <div className="blog-card" onClick={() => navigate(`/blog/${blogId}`)}>
      {publication && (
        <div className="publication">{publication}</div>
      )}
      
      <h2>{title}</h2>
      <p className="excerpt">{excerpt}</p>
      
      <div className="author-info">
        <div className="author-avatar">
          {author?.charAt(0).toUpperCase()}
        </div>
        <div className="author-name">{author}</div>
        <div className="post-date">{date}</div>
      </div>

      {tags && tags.length > 0 && (
        <div className="tags-container">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      <div className="engagement-metrics">
        <div className="metric">
          <span className="metric-icon">👁️</span>
          <span>{readTime}</span>
        </div>
        <div className="metric">
          <span className="metric-icon">❤️</span>
          <span>{likes}</span>
        </div>
        <div className="metric">
          <span className="metric-icon">💬</span>
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
