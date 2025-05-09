import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Register.module.css';

/**
 * Register component allows users to create a new account.
 * It handles user input for name, email (username), OTP verification,
 * password creation, and form submission for registration.
 */
function Register() {
  // State to store user's full name
  const [name, setName] = useState('');
  // State to store user's email (used as username)
  const [username, setUsername] = useState('');
  // State to store OTP code input by the user
  const [otpCode, setOtpCode] = useState('');
  // State to track if OTP has been requested
  const [otpRequested, setOtpRequested] = useState(false);
  // State to track if OTP has been verified successfully
  const [otpVerified, setOtpVerified] = useState(false);
  // State to store user's chosen password
  const [password, setPassword] = useState('');
  // State to store user's password confirmation input
  const [confirmPassword, setConfirmPassword] = useState('');
  // State to track loading status for async operations
  const [loading, setLoading] = useState(false);
  // State to store success message to display to the user
  const [successMessage, setSuccessMessage] = useState('');
  // State to store error message to display to the user
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Sends a request to the backend to generate and send an OTP to the user's email.
   * Validates that username (email) is provided before sending the request.
   * Updates state to reflect OTP request status and messages.
   */
  const requestOtp = async () => {
    if (!username) {
      // Handle error appropriately, e.g., show error message in UI
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/otp/request', {
        email: username,
        purpose: 'register',
      });
      setOtpRequested(true);
      setSuccessMessage('OTP sent successfully.');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Failed to send OTP.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends a request to the backend to verify the OTP entered by the user.
   * Validates that OTP code is provided before sending the request.
   * Updates state to reflect OTP verification status and messages.
   */
  const verifyOtp = async () => {
    if (!otpCode) {
      // Handle error appropriately, e.g., show error message in UI
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/otp/verify', {
        email: username,
        code: otpCode,
        purpose: 'register',
      });
      setOtpVerified(true);
      setSuccessMessage('OTP verified successfully.');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Failed to verify OTP.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form submission to register the user.
   * Validates OTP verification and password confirmation before sending registration request.
   * Sends user details to backend and updates messages and form state based on response.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    if (!otpVerified) {
      setErrorMessage('Please verify OTP before registering.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        username,
        password,
        confirmPassword,
        otpCode,
      });
      setSuccessMessage(res.data.message || 'User registered successfully.');
      setName('');
      setUsername('');
      setOtpCode('');
      setOtpRequested(false);
      setOtpVerified(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <Link to="/" className={styles.titleLink}>Keepit</Link>
      </h1>
      <div className={styles.box}>
        <h2 className={styles.heading}>
          <span>Register</span>
        </h2>
        {/* Display success message if present */}
        {successMessage && <p className={styles.successMessage} style={{ color: 'green' }}>{successMessage}</p>}
        {/* Display error message if present */}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {/* Registration form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={otpVerified || loading}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email (Username)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            disabled={otpVerified || loading}
            className={styles.input}
          />
          {/* Button to request OTP if not already requested */}
          {!otpRequested && (
            <button
              type="button"
              onClick={requestOtp}
              disabled={loading}
              className={styles.button}
            >
              Request OTP
            </button>
          )}
          {/* OTP input and verify button shown if OTP requested but not verified */}
          {otpRequested && !otpVerified && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                required
                disabled={loading}
                className={styles.input}
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading}
                className={styles.button}
              >
                Verify OTP
              </button>
            </>
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={!otpVerified || loading}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={!otpVerified || loading}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={!otpVerified || loading}
            className={styles.button}
          >
            Register
          </button>
        </form>
        <p className={styles.linkText}>
          Already have an account? <Link to="/login" className={styles.linkText}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
