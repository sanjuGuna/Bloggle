import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import '../styles/AdminSettings.css';

const AdminSettings = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Bloggle',
    siteDescription: 'A modern blogging platform',
    allowRegistration: true,
    requireEmailVerification: false,
    maxBlogsPerUser: 50,
    enableComments: true,
    enableLikes: true,
    maintenanceMode: false,
    maintenanceMessage: 'Site is under maintenance. Please check back later.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/admin/settings', { token });
      setSettings({ ...settings, ...response });
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.put('/api/admin/settings', settings, { token });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-settings">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>Site Settings</h2>
        <p>Configure your site settings and preferences</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="success-message">
          <p>Settings saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form">
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="siteDescription">Site Description</label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>User Settings</h3>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Allow new user registration
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Require email verification for new users
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="maxBlogsPerUser">Maximum Blogs Per User</label>
            <input
              type="number"
              id="maxBlogsPerUser"
              name="maxBlogsPerUser"
              value={settings.maxBlogsPerUser}
              onChange={handleInputChange}
              className="form-input"
              min="1"
              max="1000"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Content Settings</h3>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enableComments"
                checked={settings.enableComments}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Enable comments on blog posts
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="enableLikes"
                checked={settings.enableLikes}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Enable likes on blog posts
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Maintenance Mode</h3>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Enable maintenance mode
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="maintenanceMessage">Maintenance Message</label>
            <textarea
              id="maintenanceMessage"
              name="maintenanceMessage"
              value={settings.maintenanceMessage}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
              disabled={!settings.maintenanceMode}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="save-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
