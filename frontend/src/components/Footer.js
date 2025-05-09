import React from 'react';
// Importing CSS module styles for the Footer component
import styles from './Footer.module.css';

// Functional component for the Footer section of the website
function Footer() {
  return (
    // Footer element with styling applied from CSS module
    <footer className={styles.footer}>
      {/* Display a message with a heart emoji and copyright information */}
      Created with <span role="img" aria-label="love">❤️</span> by Nishant Sharma | &copy; 2025 Keepit
    </footer>
  );
}

// Exporting the Footer component as default export
export default Footer;
