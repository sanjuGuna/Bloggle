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
        <h1>Profile Settings</h1>
        <p>Manage your account preferences and personal information</p>
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
                <span className="upload-icon">📷</span>
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
            <p className="user-email">{userData.email}</p>
            <p className="user-bio">{userData.bio || 'No bio yet'}</p>
          </div>

          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Account</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="nav-icon">🔔</span>
              <span className="nav-text">Notifications</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="nav-icon">🔒</span>
              <span className="nav-text">Privacy</span>
            </button>
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Personal Information</h2>
                <p>Update your personal details and how others see you</p>
              </div>
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      className="modern-input"
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
                      className="modern-input"
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
                      className="modern-input"
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
                      className="modern-input"
                    />
                  </div>
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
                    className="modern-textarea"
                  />
                  <div className="char-count">{userData.bio.length}/200</div>
                </div>

                <button type="submit" className="modern-btn primary">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Account Settings</h2>
                <p>Manage your account security and data</p>
              </div>
              <div className="account-actions">
                <div className="action-card">
                  <div className="action-icon">🔑</div>
                  <div className="action-content">
                    <h3>Change Password</h3>
                    <p>Update your password regularly to keep your account secure</p>
                  </div>
                  <button className="modern-btn outline">Update</button>
                </div>

                <div className="action-card">
                  <div className="action-icon">📥</div>
                  <div className="action-content">
                    <h3>Export Data</h3>
                    <p>Download a copy of your personal data</p>
                  </div>
                  <button className="modern-btn outline">Export</button>
                </div>

                <div className="action-card danger">
                  <div className="action-icon">🗑️</div>
                  <div className="action-content">
                    <h3>Delete Account</h3>
                    <p>Permanently delete your account and all associated data</p>
                  </div>
                  <button className="modern-btn danger">Delete</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Notification Preferences</h2>
                <p>Control how we communicate with you</p>
              </div>
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-content">
                      <h4>Email Notifications</h4>
                      <p>Receive important updates about your account</p>
                    </div>
                    <label className="modern-toggle">
                      <input
                        type="checkbox"
                        name="notifications"
                        checked={userData.notifications}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-content">
                      <h4>Newsletter</h4>
                      <p>Get the latest news and updates from our platform</p>
                    </div>
                    <label className="modern-toggle">
                      <input
                        type="checkbox"
                        name="newsletter"
                        checked={userData.newsletter}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="modern-btn primary">Save Preferences</button>
              </form>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Privacy Settings</h2>
                <p>Control your privacy and visibility settings</p>
              </div>
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="privacy">Profile Visibility</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="privacy"
                        value="public"
                        checked={userData.privacy === 'public'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <span className="radio-label">Public</span>
                        <span className="radio-description">Anyone can see your profile</span>
                      </div>
                    </label>
                    
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="privacy"
                        value="private"
                        checked={userData.privacy === 'private'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <span className="radio-label">Private</span>
                        <span className="radio-description">Only you can see your profile</span>
                      </div>
                    </label>
                    
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="privacy"
                        value="followers"
                        checked={userData.privacy === 'followers'}
                        onChange={handleInputChange}
                      />
                      <span className="radio-custom"></span>
                      <div className="radio-content">
                        <span className="radio-label">Followers Only</span>
                        <span className="radio-description">Only your followers can see your profile</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="toggle-item">
                  <div className="toggle-content">
                    <h4>Show Email Address</h4>
                    <p>Display your email address on your public profile</p>
                  </div>
                  <label className="modern-toggle">
                    <input
                      type="checkbox"
                      name="showEmail"
                      checked={userData.showEmail}
                      onChange={handleInputChange}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <button type="submit" className="modern-btn primary">Save Privacy Settings</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;