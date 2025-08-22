import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import BlogCard from "../components/BlogCard";
import SideBar from "../components/SideBar";
import { api } from "../utils/api";
import "../styles/Home.css";

const Home = () => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/blogs', {
          timeout: 10000,
          retries: 2
        });
        
        // Backend returns { blogs, pagination }, so extract the blogs array
        const blogsData = response.blogs || [];
        setAllBlogs(blogsData);
        setBlogs(blogsData);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        if (err.message?.includes('timed out')) {
          setError('Connection timeout. Please check your internet connection.');
        } else if (err.message?.includes('Network error')) {
          setError('Unable to connect to server. Please try again.');
        } else {
          setError('Failed to load blog posts. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setBlogs(allBlogs); // show all if search is empty
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allBlogs.filter(blog =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      (blog.publication && blog.publication.toLowerCase().includes(lowerQuery)) ||
      (blog.author?.username && blog.author.username.toLowerCase().includes(lowerQuery)) ||
      (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );

    setBlogs(filtered);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="home-container">
        <div className="main-content">
          <div className="search-bar-container">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="blog-list">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  id={blog._id}
                  publication={blog.publication}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  author={blog.author?.username}
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
              ))
            ) : (
              <p className="no-results">No blogs found for your search.</p>
            )}
          </div>
        </div>
        <div className="sidebar-container">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default Home;
