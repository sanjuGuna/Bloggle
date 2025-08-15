import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/BlogDetails.css";

const dummyBlogs = [
{
    id: 1,
    title: "First Blog Post",
    content: "Full content of the first blog post goes here...",
    date: "Aug 15, 2025",
    author: "John Doe",
},
{
    id: 2,
    title: "Second Blog Post",
    content: "Full content of the second blog post goes here...",
    date: "Aug 14, 2025",
    author: "Jane Smith",
},
];

const BlogDetails = () => {
const { id } = useParams();
const navigate = useNavigate();
const blog = dummyBlogs.find((b) => b.id === Number(id));

const [images, setImages] = useState([]);

const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageUrls]);
};

if (!blog) {
    return <p>Blog not found</p>;
}

return (
    <div className="blog-details">
    <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
    <h1>{blog.title}</h1>
    <p className="meta">By {blog.author} | {blog.date}</p>
    <p className="content">{blog.content}</p>

    <h3>Add Related Images</h3>
    <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

    <div className="image-gallery">
        {images.map((src, index) => (
        <img key={index} src={src} alt={`Uploaded ${index}`} />
        ))}
    </div>
    </div>
);
};

export default BlogDetails;
