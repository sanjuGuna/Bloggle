import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BlogCard.css";

const BlogCard = ({ id, title, excerpt, author, date }) => {
  const navigate = useNavigate();

  return (
    <div className="blog-card" onClick={() => navigate(`/blog/${id}`)}>
      <h2>{title}</h2>
      <p>{excerpt}</p>
      <div className="blog-meta">
        <span>By {author}</span> | <span>{date}</span>
      </div>
    </div>
  );
};

export default BlogCard;
