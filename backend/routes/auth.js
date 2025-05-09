const express = require('express'); // Import express framework
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for JWT creation
const User = require('../models/User'); // Import User model

const router = express.Router(); // Create a new router instance

const Otp = require('../models/Otp'); // Import Otp model (currently unused in this file)

/**
 * Route to register a new user.
 * Validates required fields and password confirmation.
 * Checks if username already exists.
 * Creates and saves a new user.
 * Responds with success or error messages.
 */
router.post('/register', async (req, res) => {
  const { name, username, password, confirmPassword } = req.body;
  // Validate required fields
  if (!name || !username || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  try {
    // Check if username already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Username already exists' });

    // Create new user instance
    user = new User({ name, username, password });
    // Save user to database
    await user.save();

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Route to login a user.
 * Validates username and password.
 * Checks if user exists and password matches.
 * Generates JWT token on successful authentication.
 * Responds with token or error messages.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare provided password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT payload with user details
    const payload = { id: user._id, username: user.username, name: user.name };
    // Sign JWT token with secret and 1 hour expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.json({ token });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router to be used in the main app
module.exports = router;
