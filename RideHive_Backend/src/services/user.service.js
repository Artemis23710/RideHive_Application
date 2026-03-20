const User = require('../models/user.model');

async function createUser(data) {
  const user = new User(data);
  return user.save();
}

async function getAllUsers() {
  return User.find().sort({ createdAt: -1 }).select('-password').lean();
}

// Add function to find user by email for login
async function findUserByEmail(email) {
  return User.findOne({ email });
}

async function getUserById(id) {
  return User.findById(id).select('-password');
}

async function updateUser(id, updateData) {
  const { password, ...safeUpdateData } = updateData;
  
  // Preserve the password field if it exists
  const dataToUpdate = password 
    ? { ...safeUpdateData, password } 
    : safeUpdateData;

  // Find the user first
  const user = await User.findById(id);
  
  if (!user) {
    return null;
  }

  // Update user fields - this will mark the fields as modified
  Object.keys(dataToUpdate).forEach(key => {
    if (key === 'phone' && dataToUpdate[key] === '') {
      // Allow empty string for phone
      user[key] = dataToUpdate[key];
    } else if (dataToUpdate[key] !== undefined) {
      // Only update if value is defined
      user[key] = dataToUpdate[key];
    }
  });

  // Save the user - this will trigger the pre-save hook and automatically hash the password if it was modified
  const updatedUser = await user.save();
  
  // Return user without password
  const userWithoutPassword = updatedUser.toObject();
  delete userWithoutPassword.password;
  return userWithoutPassword;
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}



module.exports = { createUser, getAllUsers, findUserByEmail, getUserById, updateUser, deleteUser };
