import React from "react";
import "../styles/BlogCard.css";

const BlogCard = ({ title, excerpt, author, date }) => {
    return (
    <div className="blog-card">
        <h2>{title}</h2>
        <p className="meta">
        By {author} • {date}
        </p>
        <p>{excerpt}</p>
        <button>Read more →</button>
    </div>
);
};

export default BlogCard;
