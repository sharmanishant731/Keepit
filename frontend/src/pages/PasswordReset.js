import React, { useState } from 'react';
import axios from 'axios';
import styles from './PasswordReset.module.css';

/**
 * PasswordReset component allows users to update their password.
 * It provides a form to input the current password and a new password,
 * handles form submission, and displays success or error messages.
 */
function PasswordReset() {
  // State to store the current password input by the user
  const [currentPassword, setCurrentPassword] = useState('');
  // State to store the new password input by the user
  const [newPassword, setNewPassword] = useState('');
  // State to store success message after password update
  const [message, setMessage] = useState('');
  // State to store error message if password update fails
  const [error, setError] = useState('');

  /**
   * Handles form submission to update the password.
   * Prevents default form submission behavior,
   * clears previous messages,
   * sends a PUT request to update the password with authorization token,
   * and updates success or error messages based on the response.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/user/password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.titleLink}>Keepit</span>
      </h1>
      <div className={styles.box}>
        <h2 className={styles.heading}>Reset Password</h2>
        {/* Password reset form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className={styles.label}>Current Password:</label><br />
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <label className={styles.label}>New Password:</label><br />
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          {/* Display success message if present */}
          {message && <p className={styles.messageSuccess}>{message}</p>}
          {/* Display error message if present */}
          {error && <p className={styles.messageError}>{error}</p>}
          <button type="submit" className={styles.button}>Update Password</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
