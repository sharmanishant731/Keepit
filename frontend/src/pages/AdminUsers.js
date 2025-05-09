import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
// Import AuthContext to access logout function
import { AuthContext } from '../context/AuthContext';

function AdminUsers() {
  // Get logout function from AuthContext
  const { logout } = useContext(AuthContext);
  // State to hold list of users
  const [users, setUsers] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from backend API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Make GET request to fetch users with authorization header
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: 'Bearer ' + token }
      });
      // Update users state with response data
      setUsers(res.data);
    } catch (err) {
      // Handle error appropriately, e.g., show error message in UI
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a user by userId
  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      // Make DELETE request to delete user with authorization header
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: 'Bearer ' + token }
      });
      // Remove deleted user from users state
      setUsers(users.filter(user => user._id !== userId));
      // Handle success appropriately, e.g., show success message in UI
    } catch (err) {
      // Handle error appropriately, e.g., show error message in UI
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          {/* Page title */}
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          {/* Logout button */}
          <button
            onClick={logout}
            className="flex items-center space-x-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-100 transition"
          >
            <span>Logout</span>
          </button>
        </div>
        {/* Show loading message or users table */}
        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {/* Table headers */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Map over users to display each user row */}
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {/* Delete button for each user */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                      >
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
