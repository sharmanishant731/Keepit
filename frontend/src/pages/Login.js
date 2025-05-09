import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
// Import AuthContext to access login function
import { AuthContext } from '../context/AuthContext';
// Import CSS module styles for Login component
import styles from './Login.module.css';

function Login() {
  // State variables for form inputs and UI state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Track if user wants to login as admin
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const navigate = useNavigate(); // Hook for navigation
  const { login } = useContext(AuthContext); // Get login function from AuthContext

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Choose API endpoint based on admin or user login
      const url = isAdmin ? 'http://localhost:5000/api/adminAuth/login' : 'http://localhost:5000/api/auth/login';
      // Send POST request with username and password
      const response = await axios.post(url, {
        username,
        password,
      });
      // Call login function with token and role
      login(response.data.token, isAdmin ? 'admin' : 'user');
      // Navigate to admin dashboard or user home page
      navigate(isAdmin ? '/admin/users' : '/');
    } catch (err) {
      // Handle error appropriately, e.g., show error message in UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Page title with link to home */}
      <h1 className={styles.title}>
        <Link to="/" className={styles.titleLink}>Keepit</Link>
      </h1>
      <div className={styles.box}>
        {/* Heading */}
        <h2 className={styles.heading}>
          <span>Login</span>
        </h2>
        {/* Login form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Username input */}
          <input
            type="email"
            placeholder="Email (Username)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />
          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
            className={styles.input}
          />
          {/* Checkbox to login as admin */}
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
              id="adminCheckbox"
              disabled={loading}
              className={styles.checkbox}
            />
            <label htmlFor="adminCheckbox" className={styles.checkboxLabel}>Login as Admin</label>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Link to register page */}
        <p className={styles.linkText}>
          Don't have an account? <Link to="/register" className={styles.linkText}>Register here</Link>
        </p>
        {/* Link to forgot password page */}
        <p className={styles.smallLinkText}>
          <Link to="/forgot-password" className={styles.linkText}>Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
