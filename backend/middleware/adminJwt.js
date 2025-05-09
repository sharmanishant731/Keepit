const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for JWT verification

/**
 * Middleware to authenticate admin users using JWT.
 * Checks the Authorization header for a valid JWT token.
 * Verifies the token and checks if the user role is 'admin'.
 * If valid, attaches decoded user info to req.user and calls next().
 * Otherwise, responds with appropriate HTTP status and error message.
 */
function authenticateAdminJwt(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers['authorization'];
  // If no Authorization header present, respond with 401 Unauthorized
  if (!authHeader) return res.status(401).json({ message: 'Admin authorization required' });

  // Extract the token from the header (format: "Bearer token")
  const token = authHeader.split(' ')[1];
  // If token is missing, respond with 401 Unauthorized
  if (!token) return res.status(401).json({ message: 'Token missing' });

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the decoded token has admin role
    if (decoded.role === 'admin') {
      // Attach decoded user info to request object
      req.user = decoded;
      // Proceed to next middleware or route handler
      next();
    } else {
      // User is not admin, respond with 403 Forbidden
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    // Token verification failed, respond with 401 Unauthorized
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Export the authenticateAdminJwt middleware function
module.exports = { authenticateAdminJwt };
