import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileSettings from './ProfileSettings';

const ProfileSettingsWrapper = () => {
  const { user, updateProfile } = useAuth();

  const handleUpdateUser = async (userData) => {
    try {
      const result = await updateProfile(userData);
      if (result.success) {
        // Profile updated successfully
        console.log('Profile updated:', result.user);
      } else {
        console.error('Profile update failed:', result.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
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
        color: '#666'
      }}>
        Please sign in to access your profile settings.
      </div>
    );
  }

  return (
    <ProfileSettings 
      currentUser={user} 
      onUpdateUser={handleUpdateUser} 
    />
  );
};

export default ProfileSettingsWrapper;
