const express = require('express'); // Import express framework
const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for JWT creation

const router = express.Router(); // Create a new router instance

/**
 * Admin login route.
 * Accepts username and password in the request body.
 * Checks credentials against environment variables.
 * If valid, generates a JWT token with admin role and sends it in response.
 * Otherwise, responds with 401 Unauthorized and error message.
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    // Create JWT payload with username and admin role
    const payload = { username, role: 'admin' };
    // Sign the JWT token with secret and 1 hour expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Send the token and role in JSON response
    res.json({ token, role: 'admin' });
  } else {
    // Invalid credentials, respond with 401 Unauthorized
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// Export the router to be used in the main app
module.exports = router;
