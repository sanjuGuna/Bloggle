import React, { useState } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import BlogCard from "../components/BlogCard";
import Sidebar from "../components/SideBar";

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
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <SearchBar onSearch={handleSearch} />
          <div className="grid gap-4">
            {blogs.map((blog, index) => (
              <BlogCard key={index} {...blog} />
            ))}
          </div>
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
