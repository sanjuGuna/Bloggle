import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./Pages/Home";
import Layout from "./components/Layout";
import BlogDetails from "./Pages/BlogDetails";
import CreateBlogWrapper from "./components/CreateBlogWrapper";
import ProfileSettingsWrapper from "./components/ProfileSettingsWrapper";
import Login from "./components/Login";
import AdminWrapper from "./components/AdminWrapper";
import MyBlogs from "./Pages/MyBlogs";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout onShowLogin={() => setShowLogin(true)}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetails />} />
            <Route path="/create" element={<CreateBlogWrapper />} />
            <Route path="/profile" element={<ProfileSettingsWrapper />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
            <Route path="/admin" element={<AdminWrapper currentPage="dashboard" />} />
            <Route path="/admin/blogs" element={<AdminWrapper currentPage="blogs" />} />
            <Route path="/admin/users" element={<AdminWrapper currentPage="users" />} />
            <Route path="/admin/settings" element={<AdminWrapper currentPage="settings" />} />
          </Routes>
        </Layout>
        
        {showLogin && (
          <Login onClose={() => setShowLogin(false)} />
        )}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
