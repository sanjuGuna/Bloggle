import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import CreateBlog from '../Pages/CreateBlog';

const CreateBlogWrapper = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateBlog = async (blogData) => {
    if (!token) {
      alert('Please login to create a blog post.');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Creating blog:', blogData);

      // Prepare blog data for API
      const blogPayload = {
        title: blogData.title,
        content: blogData.content,
        excerpt: blogData.excerpt,
        publication: blogData.publication || undefined,
        tags: blogData.tags || [],
        status: blogData.status || 'draft'
      };

      const createdBlog = await api.post('/api/blogs', blogPayload, {
        token,
        timeout: 15000, // 15 second timeout for blog creation
        retries: 1
      });

      // Show success message
      const message = blogData.status === 'published'
        ? 'Blog published successfully!'
        : 'Blog saved as draft!';
      alert(message);

      // Navigate to the created blog or home
      if (blogData.status === 'published') {
        navigate(`/blog/${createdBlog._id}`);
      } else {
        navigate('/');
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
      onCreate={handleCreateBlog}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateBlogWrapper;
