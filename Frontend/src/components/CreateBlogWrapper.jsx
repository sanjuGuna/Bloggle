import React from 'react';
import { useAuth } from '../context/AuthContext';
import CreateBlog from '../pages/CreateBlog';

const CreateBlogWrapper = () => {
  const { user } = useAuth();

  const handleCreateBlog = async (blogData) => {
    try {
      // Here you would typically send the blog data to your backend
      console.log('Creating blog:', blogData);
      
      // For now, just show a success message
      alert('Blog created successfully! (This is a demo - no actual blog was saved)');
      
      // You can add actual API call here later:
      // const response = await fetch('/api/blogs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(blogData)
      // });
      
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog. Please try again.');
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
    />
  );
};

export default CreateBlogWrapper;
