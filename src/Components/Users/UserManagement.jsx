import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

// Set base URL once for axios
axios.defaults.baseURL = 'http://localhost:5000';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roleUpdates, setRoleUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Make sure token key matches login storage key
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.data.users);
      } catch (err) {
        console.error('Fetch users error:', err);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUsers();
    else {
      setError('No admin token found. Please login.');
      setLoading(false);
    }
  }, [token]);

  const handleRoleChange = (userId, newRole) => {
    setRoleUpdates((prev) => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleUpdate = async (userId) => {
    try {
      const updatedRole = roleUpdates[userId];
      await axios.put(
        `/admin/users/${userId}/roles`,
        { roles: [updatedRole] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, roles: [updatedRole] } : user
        )
      );
      setRoleUpdates((prev) => {
        const newUpdates = { ...prev };
        delete newUpdates[userId];
        return newUpdates;
      });
    } catch (err) {
      console.error('Update role error:', err);
      setError('Failed to update user role');
    }
  };

  const toggleStatus = async (userId) => {
    try {
      const response = await axios.put(
        `/admin/users/${userId}/status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedUser = response.data.user;
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? updatedUser : user))
      );
    } catch (err) {
      console.error('Toggle status error:', err);
      setError('Failed to toggle user status');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

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
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  {roleUpdates[user._id] && (
                    <button onClick={() => saveRoleUpdate(user._id)}>Save Role</button>
                  )}
                  <button onClick={() => toggleStatus(user._id)}>
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
