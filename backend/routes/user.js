const express = require('express'); // Import express framework
const User = require('../models/User'); // Import User model
const { authenticateToken } = require('../middleware/auth'); // Import user authentication middleware

const router = express.Router(); // Create a new router instance

/**
 * Route to update the password for the authenticated user.
 * Requires current password and new password in the request body.
 * Validates current password before updating.
 */
router.put('/password', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  try {
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    // Update password and save user
    user.password = newPassword;
    await user.save();

    // Respond with success message
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Route to reset password without authentication (for forgot password flow).
 * Requires email and new password in the request body.
 */
router.put('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate required fields
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    // Find user by email (username)
    const user = await User.findOne({ username: email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update password and save user
    user.password = newPassword;
    await user.save();

    // Respond with success message
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router to be used in the main app
module.exports = router;
