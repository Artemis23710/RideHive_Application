// authController.js - Separate controller for authentication
const authService = require('../services/auth.Service');
const jwt = require('jsonwebtoken');


async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    const result = await authService.authenticateUser(email, password);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.id,
        email: result.email,
        // Add any other user data you want in the token
      },
      process.env.JWT_SECRET, // Store this in your .env file
      { 
        expiresIn: '24h' // Token expires in 24 hours
      }
    );
    
     res.status(200).json({
      message: 'Login successful',
       token: token,
      data: result
    });

  } catch (err) {
    console.error('Error during login:', err);
    
    if (err.message === 'User not found' || err.message === 'Invalid password') {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }
    
    next(err);
  }
}

// Logout user (optional - for future use)
async function logout(req, res, next) {
  try {
    // You can implement logout logic here (token blacklisting, etc.)
    res.status(200).json({
      message: 'Logout successful'
    });
  } catch (err) {
    console.error('Error during logout:', err);
    next(err);
  }
}

module.exports = {
  login,
  logout
};