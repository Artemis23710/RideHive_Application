const userService = require('../services/user.service');

// Create user function that handles both JSON and form-data
async function createUser(req, res, next) {
  try {
    console.log('Request body:', req.body)
    
    const userData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      password: req.body.password,
      role: req.body.role || 'customer',
      status: req.body.status || 'active'
    }

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, password'
      })
    }

    const user = await userService.createUser(userData)

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    res.status(201).json({
      message: 'User created successfully',
      data: userResponse
    })
  } catch (err) {
    console.error('Error creating user:', err)

    // Handle duplicate email
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists'
      })
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        details: err.message
      })
    }
    
    next(err)
  }
}

// Add listUsers function that's referenced in your routes
async function listUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers()
    
    res.status(200).json({
      message: 'Users retrieved successfully',
      data: users
    })
  } catch (err) {
    console.error('Error retrieving users:', err)
    next(err)
  }
}

async function getUserById(req, res, next) {
   try {
     // Get ID from URL parameter OR query parameter
     const userId = req.params.id || req.query.id;

     if (!userId) {
       return res.status(400).json({
         error: 'User ID is required'
       });
     }

     const user = await userService.getUserById(userId);

     if (!user) {
       return res.status(404).json({
         error: 'User not found'
       });
     }

     res.status(200).json({
       message: 'User retrieved successfully',
       data: user
     });
   } catch (err) {
     console.error('Error retrieving user:', err);

     if (err.name === 'CastError') {
       return res.status(400).json({
         error: 'Invalid user ID'
       });
     }

     next(err);
   }
}


// Update user
// Update user
async function updateUser(req, res, next) {
  try {
    const { id, name, email, password, phone, role, status } = req.body;

    // Validate that ID is provided
    if (!id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }

    // Build update data object with only provided fields
    const updateData = {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(password !== undefined && { password }),
      ...(phone !== undefined && { phone: phone || '' }), // Allow empty string
      ...(role !== undefined && { role }),
      ...(status !== undefined && { status })
    };

    // Validate that at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'At least one field is required for update'
      });
    }

    // Validate email format if provided
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Please provide a valid email address'
        });
      }
    }

    // Validate password if provided
    if (password) {
      if (password.length < 8) { // Changed from 6 to 8 to match frontend
        return res.status(400).json({
          error: 'Password must be at least 8 characters long'
        });
      }
    }


    const user = await userService.updateUser(id, updateData);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: user
    });
  } catch (err) {
    console.error('Error updating user:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.message
      });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user ID format'
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }
    
    next(err);
  }
}

// Delete user
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    
    const user = await userService.deleteUser(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user ID'
      });
    }
    
    next(err);
  }
}


async function RegisterUser(req, res, next) {
  try {
    console.log('Request Body:', req.body);

    // Extract data from request body (works for both JSON and form-data)
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, password'
      });
    }

    const user = await userService.createUser(userData);

    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      data: userResponse
    });
  } catch (err) {
    console.error('Error creating user:', err);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.message
      });
    }
    next(err);
  }
}

module.exports = { createUser, listUsers, getUserById, updateUser, deleteUser,RegisterUser };