import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from '../Pages/AdminDashboard';
import AdminBlogs from '../Pages/AdminBlogs';
import AdminUsers from '../Pages/AdminUsers';
import AdminSettings from '../Pages/AdminSettings';

const AdminWrapper = ({ currentPage }) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin (you might want to add an admin role to your user model)
  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  if (!token || !user) {
    navigate('/');
    return null;
  }

  if (!isAdmin) {
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
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin panel.</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'blogs':
        return <AdminBlogs />;
      case 'users':
        return <AdminUsers />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage}>
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminWrapper;
