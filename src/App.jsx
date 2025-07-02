import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import './App.css';

const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token in URL hash
    const hash = window.location.hash;
    let token = null;

    if (hash.includes('token=')) {
      token = decodeURIComponent(hash.split('token=')[1]);
      // Clear the hash from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      token = localStorage.getItem('auth-token');
    }

    if (!token) {
      redirectToMainLogin();
      return;
    }

    const verifyAdminAccess = async () => {
      try {
        const response = await fetch('http://localhost:5000/verify-token', {
          headers: {
            'auth-token': token
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user?.roles?.includes('admin')) {
            // Store token in localStorage for persistent session
            localStorage.setItem('auth-token', token);
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            throw new Error('Admin privileges required');
          }
        } else {
          throw new Error('Token verification failed');
        }
      } catch (error) {
        console.error('Admin access error:', error);
        handleFailedAuth();
      } finally {
        setLoading(false);
      }
    };

    verifyAdminAccess();
  }, []);

  const redirectToMainLogin = () => {
    localStorage.removeItem('auth-token');
    window.location.href = 'http://localhost:3000/login';
  };

  const handleFailedAuth = () => {
    localStorage.removeItem('auth-token');
    redirectToMainLogin();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.href = 'http://localhost:3000';
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="admin-app-container">
      <Navbar user={user} onLogout={handleLogout} />
      <main className="admin-main-content">
        <Admin user={user} />
      </main>
    </div>
  );
};

export default AdminApp;