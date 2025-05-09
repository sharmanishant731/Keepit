const adminUsername = process.env.ADMIN_USERNAME; // Admin username from environment variables
const adminPassword = process.env.ADMIN_PASSWORD; // Admin password from environment variables

/**
 * Middleware to authenticate admin users using Basic Auth.
 * Checks the Authorization header for valid admin credentials.
 * If valid, calls next() to proceed to the next middleware/route handler.
 * Otherwise, responds with appropriate HTTP status and error message.
 */
function authenticateAdmin(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers['authorization'];
  // If no Authorization header present, respond with 401 Unauthorized
  if (!authHeader) return res.status(401).json({ message: 'Admin authorization required' });

  // Extract base64 encoded credentials from header (format: "Basic base64credentials")
  const base64Credentials = authHeader.split(' ')[1];
  // Decode base64 credentials to ASCII string "username:password"
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  // Split the credentials into username and password
  const [username, password] = credentials.split(':');

  // Check if provided credentials match the admin credentials
  if (username === adminUsername && password === adminPassword) {
    // Credentials valid, proceed to next middleware or route handler
    next();
  } else {
    // Credentials invalid, respond with 403 Forbidden
    res.status(403).json({ message: 'Invalid admin credentials' });
  }
}

// Export the authenticateAdmin middleware function
module.exports = { authenticateAdmin };
