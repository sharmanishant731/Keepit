import React from 'react';
// Import useNavigate hook for navigation
import { useNavigate } from 'react-router-dom';
// Import Footer component
import Footer from '../components/Footer';
// Import CSS module styles for Landing component
import styles from './Landing.module.css';

function Landing() {
  // Initialize navigate function for programmatic navigation
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Main title */}
      <h1 className={styles.title}>Keepit</h1>
      {/* Subtitle describing the app */}
      <p className={styles.subtitle}>A Notes App with User Authentication</p>
      {/* Container for login and register buttons */}
      <div className={styles.buttonContainer}>
        {/* Login button navigates to /login */}
        <button
          className={styles.button}
          onClick={() => navigate('/login')}
          type="button"
        >
          <span>Login</span>
        </button>
        {/* Register button navigates to /register */}
        <button
          className={styles.button}
          onClick={() => navigate('/register')}
          type="button"
        >
          <span>Register</span>
        </button>
      </div>
      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default Landing;
