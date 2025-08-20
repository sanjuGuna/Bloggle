import React, { useState } from 'react';
import '../styles/ProfileSettings.css';

const ProfileSettings = ({ currentUser, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    website: currentUser?.website || '',
    avatar: currentUser?.avatar || '',
    notifications: currentUser?.notifications || true,
    newsletter: currentUser?.newsletter || false,
    privacy: currentUser?.privacy || 'public'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(userData);
    alert('Profile updated successfully!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData(prev => ({
          ...prev,
          avatar: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-settings-container">
      <div className="profile-header">
        <h1>Profile & Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        <div className="sidebar">
          <div className="user-card">
            <div className="avatar-container">
              <img 
                src={userData.avatar || '/default-avatar.png'} 
                alt={userData.username} 
                className="avatar"
              />
              <label htmlFor="avatar-upload" className="avatar-upload-label">
                <span>Change Photo</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="avatar-upload-input"
              />
            </div>
            <h2>{userData.username}</h2>
            <p>{userData.bio || 'No bio yet'}</p>
          </div>

          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span>👤</span> Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <span>⚙️</span> Account Settings
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span>🔔</span> Notifications
            </button>
            <button 
              className={`nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span>🔒</span> Privacy
            </button>
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Profile Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={userData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={userData.location}
                    onChange={handleInputChange}
                    placeholder="Where are you based?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={userData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>

                <button type="submit" className="save-btn">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="tab-content">
              <h2>Account Settings</h2>
              <div className="account-actions">
                <div className="action-card">
                  <h3>Change Password</h3>
                  <p>Update your password regularly to keep your account secure</p>
                  <button className="action-btn">Change Password</button>
                </div>

                <div className="action-card">
                  <h3>Export Data</h3>
                  <p>Download a copy of your personal data</p>
                  <button className="action-btn">Export Data</button>
                </div>

                <div className="action-card danger">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all associated data</p>
                  <button className="action-btn danger">Delete Account</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="tab-content">
              <h2>Notification Preferences</h2>
              <form onSubmit={handleSubmit}>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={userData.notifications}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Enable email notifications
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={userData.newsletter}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Subscribe to newsletter
                  </label>
                </div>

                <button type="submit" className="save-btn">Save Preferences</button>
              </form>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="tab-content">
              <h2>Privacy Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="privacy">Profile Visibility</label>
                  <select
                    id="privacy"
                    name="privacy"
                    value={userData.privacy}
                    onChange={handleInputChange}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="followers">Followers Only</option>
                  </select>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showEmail"
                      checked={userData.showEmail}
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                    Show email on profile
                  </label>
                </div>

                <button type="submit" className="save-btn">Save Privacy Settings</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;