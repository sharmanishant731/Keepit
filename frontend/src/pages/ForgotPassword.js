import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// Import CSS module styles for ForgotPassword component
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
  // State variables for form inputs and UI state
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // Track current step in the forgot password flow
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const [successMessage, setSuccessMessage] = useState(''); // Success message to display
  const [errorMessage, setErrorMessage] = useState(''); // Error message to display

  // Function to request OTP for password reset
  const requestOtp = async () => {
    if (!email) {
      // Handle error appropriately, e.g., show error message in UI
      return;
    }
    setLoading(true);
    try {
      // Send POST request to request OTP for the given email and purpose
      const res = await axios.post('http://localhost:5000/api/otp/request', { email, purpose: 'forgotPassword' });
      setSuccessMessage('OTP sent successfully.');
      setErrorMessage('');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setErrorMessage('Failed to send OTP.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Function to verify the OTP entered by the user
  const verifyOtp = async () => {
    if (!otp) {
      // Handle error appropriately, e.g., show error message in UI
      return;
    }
    setLoading(true);
    try {
      // Send POST request to verify OTP for the given email and purpose
      const res = await axios.post('http://localhost:5000/api/otp/verify', { email, code: otp, purpose: 'forgotPassword' });
      setSuccessMessage('OTP verified successfully.');
      setErrorMessage('');
      setStep(3); // Move to password reset step
    } catch (err) {
      setErrorMessage('Failed to verify OTP.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the password after OTP verification
  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      // Handle error appropriately, e.g., show error message in UI
      return;
    }
    setLoading(true);
    try {
      // Send PUT request to reset password for the given email
      const res = await axios.put('http://localhost:5000/api/user/reset-password', { email, newPassword });
      // Handle success appropriately, e.g., show success message in UI
      setStep(4); // Move to success confirmation step
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
        <h2 className={styles.heading}>
          <span>Forgot Password</span>
        </h2>
        {/* Display success or error messages */}
        {successMessage && <p className={styles.successMessage} style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {/* Step 1: Request OTP */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              className={styles.input}
            />
            <button
              onClick={requestOtp}
              disabled={loading}
              className={styles.button}
            >
              Request OTP
            </button>
          </>
        )}
        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              disabled={loading}
              className={styles.input}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className={styles.button}
            >
              Verify OTP
            </button>
          </>
        )}
        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              disabled={loading}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className={styles.input}
            />
            <button
              onClick={resetPassword}
              disabled={loading}
              className={styles.button}
            >
              Reset Password
            </button>
          </>
        )}
        {/* Step 4: Success message */}
        {step === 4 && (
          <p className={styles.successMessage}>
            Password reset successful. You can now <Link to="/login" className={styles.linkText}>login</Link>.
          </p>
        )}
        {/* Link to login page */}
        <p className={styles.linkText}>
          Changed your Mind? <Link to="/login" className={styles.linkText}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
