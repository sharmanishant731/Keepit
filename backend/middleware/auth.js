const jwt = require('jsonwebtoken'); // Import jsonwebtoken library for JWT verification

/**
 * Middleware to authenticate users using JWT.
 * Checks the Authorization header for a valid JWT token.
 * Verifies the token and attaches decoded user info to req.user.
 * If token is missing or invalid, responds with appropriate HTTP status and error message.
 */
function authenticateToken(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers['authorization'];
  // Extract the token from the header (format: "Bearer token")
  const token = authHeader && authHeader.split(' ')[1];
  // If token is missing, respond with 401 Unauthorized
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // If token verification fails, respond with 403 Forbidden
    if (err) return res.status(403).json({ message: 'Invalid token' });
    // Attach decoded user info to request object
    req.user = user;
    // Proceed to next middleware or route handler
    next();
  });
}

// Export the authenticateToken middleware function
module.exports = { authenticateToken };
