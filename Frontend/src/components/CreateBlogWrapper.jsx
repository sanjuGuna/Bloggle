import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import CreateBlog from '../Pages/CreateBlog';

const CreateBlogWrapper = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialBlog, setInitialBlog] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const edit = params.get('edit');

    if (edit) {
      setEditingId(edit);
    } else {
      setEditingId(null);
      setInitialBlog(null);
      setEditError(null);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchBlogForEdit = async () => {
      if (!editingId || !token) return;

      try {
        setLoadingEdit(true);
        setEditError(null);
        const blog = await api.get(`/api/blogs/${editingId}/edit`, { token });
        setInitialBlog(blog);
      } catch (error) {
        console.error('Error loading blog for edit:', error);
        setEditError(error.message || 'Failed to load blog for editing.');
      } finally {
        setLoadingEdit(false);
      }
    };

    fetchBlogForEdit();
  }, [editingId, token]);

  const handleSaveBlog = async (blogData) => {
    if (!token) {
      alert('Please login to create a blog post.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log(editingId ? 'Updating blog:' : 'Creating blog:', blogData);

      // Prepare blog data for API
      const blogPayload = {
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt,
        publication: blogData.publication || undefined,
        tags: blogData.tags || [],
        status: blogData.status || 'draft'
      };

      let savedBlog;
      if (editingId) {
        savedBlog = await api.put(`/api/blogs/${editingId}`, blogPayload, {
          token,
          timeout: 15000,
          retries: 1
        });
      } else {
        savedBlog = await api.post('/api/blogs', blogPayload, {
          token,
          timeout: 15000, // 15 second timeout for blog creation
          retries: 1
        });
      }

      // Show success message
      const message = blogData.status === 'published'
        ? (editingId ? 'Blog updated and published!' : 'Blog published successfully!')
        : (editingId ? 'Draft updated successfully!' : 'Blog saved as draft!');
      alert(message);

      // Navigate to the blog or My Blogs
      if (blogData.status === 'published') {
        navigate(`/blog/${savedBlog._id}`);
      } else {
        navigate('/my-blogs');
      }

    } catch (error) {
      console.error('Error creating blog:', error);

      let errorMessage = 'Failed to create blog. Please try again.';

      if (error.message?.includes('timed out')) {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message?.includes('Network error')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Your session has expired. Please login again.';
      } else if (error.status === 400) {
        errorMessage = error.message || 'Invalid blog data. Please check your inputs.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated, show a message
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '1.2rem',
        color: '#666',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <p>Please sign in to create a blog post.</p>
          <p style={{ fontSize: '1rem', marginTop: '1rem' }}>
            You need to be logged in to access the blog creation feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <CreateBlog
      currentUser={user}
      onCreate={handleSaveBlog}
      initialBlog={initialBlog}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateBlogWrapper;
