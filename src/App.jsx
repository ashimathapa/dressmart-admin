import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Admin from './Pages/Admin/Admin';
import Login from './Pages/Login/Login';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogin = (token, userData) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <Admin user={user} />
        </>
      )}
    </div>
  );
};

export default App;