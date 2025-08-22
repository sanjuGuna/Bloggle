import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import BlogCard from "../components/BlogCard";
import SideBar from "../components/SideBar";
import "../styles/Home.css";

const Home = () => {
  const allBlogs = [
    {
      publication: "Starts With A Bang!",
      title: "What a nuclear reactor on the Moon really means for NASA's future",
      excerpt: "There are real concerns with long-term power generation on the Moon; nuclear could be the solution we've been searching for...",
      author: "Ethan Siegel",
      date: "Aug 15, 2025",
      readTime: "8 min read",
      tags: ["Space", "Technology", "NASA"],
      likes: 124,
      comments: 18
    },
    {
      publication: "Cabin Fever Magazine",
      title: "An Introduction to Media Epidemiology",
      excerpt: "A deep dive into how media and communications are intimately related to the health of a population...",
      author: "Esha Brahmbhatt",
      date: "Aug 14, 2025",
      readTime: "6 min read",
      tags: ["Media", "Public Health", "Sociology"],
      likes: 89,
      comments: 12
    },
    {
      publication: "Lessig",
      title: "Courage versus Complicity [updated]",
      excerpt: "As retired Admiral Mark Montgomery recently put it, the strategy of Donald Trump is not unusual for authoritarian leaders...",
      author: "Lawrence Lessig",
      date: "Aug 12, 2025",
      readTime: "10 min read",
      tags: ["Politics", "Leadership", "History"],
      likes: 215,
      comments: 42
    },
    {
      publication: "An Injustice!",
      title: "The Panopticon Spreads: Social regulation in the information age",
      excerpt: "How modern technology has realized Bentham's centuries-old prison design concept in our daily digital lives...",
      author: "Sam Young",
      date: "Aug 10, 2025",
      readTime: "7 min read",
      tags: ["Privacy", "Technology", "Philosophy"],
      likes: 76,
      comments: 9
    },
    {
      publication: "Techno Sapiens",
      title: "Is the Age of AI Inevitable? Or is that what they want us to think?",
      excerpt: "Examining the narratives surrounding artificial intelligence and questioning technological determinism...",
      author: "George Dillard",
      date: "Aug 8, 2025",
      readTime: "9 min read",
      tags: ["AI", "Future", "Critical Theory"],
      likes: 153,
      comments: 27
    },
    {
      publication: "Policy Panorama",
      title: "The Peace Agreement That Killed a President",
      excerpt: "The conflicted legacy of Anwar Sadat in Egypt and the complex geopolitics of Middle East diplomacy...",
      author: "Brad Yonaka",
      date: "Aug 5, 2025",
      readTime: "11 min read",
      tags: ["History", "Middle East", "Diplomacy"],
      likes: 98,
      comments: 15
    }
  ];

  const [blogs, setBlogs] = useState(allBlogs);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setBlogs(allBlogs); // show all if search is empty
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allBlogs.filter(blog =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.publication.toLowerCase().includes(lowerQuery) ||
      blog.author.toLowerCase().includes(lowerQuery) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    setBlogs(filtered);
  };

  return (
    <div> 
      <div className="home-container">
        <div className="main-content">
          <div className="search-bar-container">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="blog-list">
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <BlogCard 
                  key={index}
                  publication={blog.publication}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  author={blog.author}
                  date={blog.date}
                  readTime={blog.readTime}
                  tags={blog.tags}
                  likes={blog.likes}
                  comments={blog.comments}
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
