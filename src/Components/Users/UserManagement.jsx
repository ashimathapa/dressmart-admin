import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

// Set base URL for API calls
axios.defaults.baseURL = 'http://localhost:5000';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roleUpdates, setRoleUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set auth token for all requests
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users');
        setUsers(response.data.data.users);
      } catch (err) {
        console.error('Fetch users error:', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setRoleUpdates((prev) => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleUpdate = async (userId) => {
    try {
      const updatedRole = roleUpdates[userId];
      const response = await axios.put(
        `/admin/users/${userId}/roles`,
        { roles: [updatedRole] }
      );
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? response.data.user : user
        )
      );
      
      // Clear the pending update
      setRoleUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[userId];
        return newUpdates;
      });
    } catch (err) {
      console.error('Update role error:', err);
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const toggleStatus = async (userId) => {
    try {
      const response = await axios.put(`/admin/users/${userId}/status`);
      const updatedUser = response.data.user;
      
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? updatedUser : user))
      );
    } catch (err) {
      console.error('Toggle status error:', err);
      setError(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  if (loading) return <p className="loading-message">Loading users...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="user-management-container">
      <h2>Admin: User Management</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name / Email</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const selectedRole = roleUpdates[user._id] || user.roles?.[0] || 'user';
            return (
              <tr key={user._id}>
                <td>{user.name || user.email}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="role-selector"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="action-buttons">
                  {roleUpdates[user._id] && (
                    <button 
                      onClick={() => saveRoleUpdate(user._id)}
                      className="save-btn"
                    >
                      Save Role
                    </button>
                  )}
                  <button 
                    onClick={() => toggleStatus(user._id)}
                    className={`status-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;