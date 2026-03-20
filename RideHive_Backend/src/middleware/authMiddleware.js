const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Token has expired'
          });
        }
        if (err.name === 'JsonWebTokenError') {
          return res.status(403).json({
            error: 'Invalid token'
          });
        }
        return res.status(403).json({
          error: 'Failed to authenticate token'
        });
      }

      // Attach user info to request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: 'Internal server error during authentication'
    });
  }
};

// Optional: Role-based middleware (if you have user roles)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};