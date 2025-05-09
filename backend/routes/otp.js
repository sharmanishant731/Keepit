const express = require('express'); // Import express framework
const Otp = require('../models/Otp'); // Import Otp model
const User = require('../models/User'); // Import User model
const { sendOtpEmail } = require('../utils/email'); // Import utility to send OTP email
const crypto = require('crypto'); // Import crypto module (currently unused)

const router = express.Router(); // Create a new router instance

/**
 * Helper function to generate a random 6-digit OTP code as a string.
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Route to request an OTP for registration or forgot password.
 * Validates email and purpose.
 * Checks if email is already registered or exists based on purpose.
 * Generates OTP, saves it with expiry, and sends OTP email.
 */
router.post('/request', async (req, res) => {
  const { email, purpose } = req.body; // purpose: 'register' or 'forgotPassword'
  // Validate required fields
  if (!email || !purpose) {
    return res.status(400).json({ message: 'Email and purpose are required' });
  }

  try {
    // Check if email is already registered for registration purpose
    if (purpose === 'register') {
      const existingUser = await User.findOne({ username: email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    } else if (purpose === 'forgotPassword') {
      // Check if email exists for forgot password purpose
      const user = await User.findOne({ username: email });
      if (!user) {
        return res.status(400).json({ message: 'Email not found' });
      }
    } else {
      // Invalid purpose value
      return res.status(400).json({ message: 'Invalid purpose' });
    }

    // Generate OTP code and expiry time (10 minutes from now)
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Remove existing OTPs for this email and purpose to avoid duplicates
    await Otp.deleteMany({ email, purpose });

    // Save new OTP document
    const otp = new Otp({ email, code, expiresAt, purpose });
    await otp.save();

    // Send OTP email to the user
    await sendOtpEmail(email, code);

    // Respond with success message
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Route to verify an OTP.
 * Validates email, code, and purpose.
 * Checks if OTP exists and is not expired.
 * Deletes OTP after successful verification.
 */
router.post('/verify', async (req, res) => {
  const { email, code, purpose } = req.body;
  // Validate required fields
  if (!email || !code || !purpose) {
    return res.status(400).json({ message: 'Email, code, and purpose are required' });
  }

  try {
    // Find OTP document matching email, code, and purpose
    const otp = await Otp.findOne({ email, code, purpose });
    if (!otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    // Check if OTP is expired
    if (otp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // OTP is valid, delete it to prevent reuse
    await Otp.deleteOne({ _id: otp._id });

    // Respond with success message
    res.json({ message: 'OTP verified' });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router to be used in the main app
module.exports = router;
