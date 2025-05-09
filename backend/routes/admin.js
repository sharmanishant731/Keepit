const express = require('express'); // Import express framework
const User = require('../models/User'); // Import User model
const { authenticateAdminJwt } = require('../middleware/adminJwt'); // Import admin JWT authentication middleware

const router = express.Router(); // Create a new router instance

/**
 * Route to get all users.
 * Protected route - only accessible by authenticated admin users.
 * Returns a list of users with their name, username, and _id fields.
 */
router.get('/users', authenticateAdminJwt, async (req, res) => {
  try {
    // Query all users selecting only name, username, and _id fields
    const users = await User.find({}, 'name username _id');
    // Send the list of users as JSON response
    res.json(users);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Route to delete a user by ID.
 * Protected route - only accessible by authenticated admin users.
 * Deletes the user with the specified ID.
 */
router.delete('/users/:id', authenticateAdminJwt, async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.id;
    // Delete the user document by ID
    await User.findByIdAndDelete(userId);
    // Send success message as JSON response
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the router to be used in the main app
module.exports = router;
