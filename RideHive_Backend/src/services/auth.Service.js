// authService.js - Separate service for authentication
const User = require('../models/user.model');

const authService = {
  // Authenticate user
  async authenticateUser(email, password) {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      throw new Error('User not found');
    }

    // Compare password using the schema method
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Return user data without password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    // You can add JWT token generation here if needed
    // const token = generateToken(userWithoutPassword);
    
    return {
      user: userWithoutPassword,
      // token: token // Include if using JWT
    };
  },

  // Validate token (optional - for future use)
  async validateToken(token) {
    // Implement token validation logic
    throw new Error('Not implemented');
  },

  // Refresh token (optional - for future use)
  async refreshToken(oldToken) {
    // Implement token refresh logic
    throw new Error('Not implemented');
  }
};

module.exports = authService;