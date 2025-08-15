import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import BlogCard from "../components/BlogCard";
import Sidebar from "../components/SideBar";
import "../styles/Home.css";

const Home = () => {
  const [blogs] = useState([
    {
      title: "First Blog Post",
      excerpt: "This is a short description of the first blog post...",
      author: "John Doe",
      date: "Aug 15, 2025",
    },
    {
      title: "Second Blog Post",
      excerpt: "This is a short description of the second blog post...",
      author: "Jane Smith",
      date: "Aug 14, 2025",
    },
  ]);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // later: fetch blogs from backend API
  };

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="main-content">
          <SearchBar onSearch={handleSearch} />
          <div className="blog-list">
            {blogs.map((blog, index) => (
              <BlogCard key={index} {...blog} />
            ))}
          </div>
        </div>
        <div className="sidebar-container">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
