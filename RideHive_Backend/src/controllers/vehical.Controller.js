const vehicalService = require('../services/vehical.Service');
const path = require('path');

// Configure multer for memory storage (images stored in MongoDB)
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed!'));
  }
});

// Middleware for single file upload
const uploadSingle = upload.single('vehicalimage');

async function createVehical(req, res, next) {
  try {
    console.log('Request body:', req.body);
    console.log('File received:', req.file ? 'Yes' : 'No');
    
    // Check required fields first
    if (!req.body.vehicalname || !req.body.category || !req.body.vehicalnumber) {
      return res.status(400).json({
        message: 'Missing required fields: vehicalname, category, vehicalnumber'
      });
    }

    let imageData = null;
    
    // Process the uploaded file
    if (req.file) {
      console.log('File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      // Generate custom filename for reference
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
      const fileExtension = path.extname(req.file.originalname) || '.jpg';
      const vehicleNumber = req.body.vehicalnumber.replace(/[^a-zA-Z0-9]/g, '_');
      const customFilename = `${vehicleNumber}_${formattedDate}${fileExtension}`;
      
      imageData = {
        data: req.file.buffer, // Store binary data in MongoDB
        contentType: req.file.mimetype,
        filename: customFilename,
        originalname: req.file.originalname,
        size: req.file.size,
        uploadedAt: date
      };
    }

    // Prepare vehicle data
    const vehicalData = {
      vehicalname: req.body.vehicalname,
      category: req.body.category,
      type: req.body.type || '',
      vehicalnumber: req.body.vehicalnumber,
      pasengercapacity: parseInt(req.body.pasengercapacity) || 0,
      location: req.body.location || '',
      baseprice: parseFloat(req.body.baseprice) || 0,
      vehicalstatus: req.body.vehicalstatus || 'Available',
      vehicalimage: imageData,
      availabilitySchedule: req.body.availabilitySchedule || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      status: req.body.status || 'Active'
    };

    // Create vehicle
    const vehical = await vehicalService.createVehical(vehicalData);

    // Prepare response (don't send binary data in response)
    const responseData = {
      _id: vehical._id,
      vehicalname: vehical.vehicalname,
      category: vehical.category,
      type: vehical.type,
      vehicalnumber: vehical.vehicalnumber,
      pasengercapacity: vehical.pasengercapacity,
      location: vehical.location,
      baseprice: vehical.baseprice,
      vehicalstatus: vehical.vehicalstatus,
      vehicalimage: vehical.vehicalimage ? {
        filename: vehical.vehicalimage.filename,
        size: vehical.vehicalimage.size,
        contentType: vehical.vehicalimage.contentType,
        url: `/api/vehicles/${vehical._id}/image`
      } : null,
      availabilitySchedule: vehical.availabilitySchedule,
      status: vehical.status,
      createdAt: vehical.createdAt
    };

    res.status(201).json({
      message: 'Vehicle created successfully',
      data: responseData
    });
    
  } catch (err) {
    handleVehicleError(err, res, next);
  }
}

async function listVehicale(req, res, next) {
  try {
    const vehicals = await vehicalService.getAllVehical();
    
    // Format vehicles with image URLs (don't send binary data)
    const formattedVehicals = vehicals.map(vehicle => ({
      _id: vehicle._id,
      vehicalname: vehicle.vehicalname,
      category: vehicle.category,
      type: vehicle.type,
      vehicalnumber: vehicle.vehicalnumber,
      pasengercapacity: vehicle.pasengercapacity,
      location: vehicle.location,
      baseprice: vehicle.baseprice,
      vehicalstatus: vehicle.vehicalstatus,
      vehicalimage: vehicle.vehicalimage && vehicle.vehicalimage.data ? {
        filename: vehicle.vehicalimage.filename,
        size: vehicle.vehicalimage.size,
        contentType: vehicle.vehicalimage.contentType,
        url: `/api/vehicles/${vehicle._id}/image`
      } : null,
      availabilitySchedule: vehicle.availabilitySchedule,
      status: vehicle.status,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    }));
    
    res.status(200).json({
      message: 'Vehicles retrieved successfully',
      count: formattedVehicals.length,
      data: formattedVehicals
    });
  } catch (err) {
    console.error('Error retrieving vehicles:', err);
    next(err);
  }
}

async function getVehicaleById(req, res, next) {
   try {
     // Get ID from URL parameter OR query parameter
     const vehicalId = req.params.id || req.query.id;

     if (!vehicalId) {
       return res.status(400).json({
         error: 'Vehicle ID is required'
       });
     }

     const vehical = await vehicalService.getVehicaleById(vehicalId);   
     if (!vehical) {
       return res.status(404).json({
         error: 'Vehicle not found'
       });
     }

     // Format response with image URL (don't send binary data)
     const formattedVehicle = {
       _id: vehical._id,
       vehicalname: vehical.vehicalname,
       category: vehical.category,
       type: vehical.type,
       vehicalnumber: vehical.vehicalnumber,
       pasengercapacity: vehical.pasengercapacity,
       location: vehical.location,
       baseprice: vehical.baseprice,
       vehicalstatus: vehical.vehicalstatus,
       vehicalimage: vehical.vehicalimage ? {
         filename: vehical.vehicalimage.filename,
         contentType: vehical.vehicalimage.contentType,
         size: vehical.vehicalimage.size,
         uploadedAt: vehical.vehicalimage.uploadedAt,
         url: `/api/vehicles/${vehical._id}/image`
       } : null,
       availabilitySchedule: vehical.availabilitySchedule,
       status: vehical.status,
       createdAt: vehical.createdAt,
       updatedAt: vehical.updatedAt
     };

     res.status(200).json({
       message: 'Vehicle retrieved successfully',
       data: formattedVehicle
     });
   } catch (err) {
     console.error('Error retrieving vehicle:', err);
     if (err.name === 'CastError') {
       return res.status(400).json({
         error: 'Invalid vehicle ID'
       });
     }
     next(err);
   }
}

async function updateVehical(req, res, next) {
  try {
    console.log('Update request body:', req.body);
    console.log('Update file received:', req.file ? 'Yes' : 'No');
    
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: 'Vehicle ID is required'
      });
    }

    // Create update data object
    const updateData = {};
    
    // Only include fields that are being updated
    const allowedFields = [
      'vehicalname',
      'category',
      'type',
      'vehicalnumber',
      'pasengercapacity',
      'location',
      'baseprice',
      'vehicalstatus',
      'availabilitySchedule',
      'status'
    ];

    // Add fields from request body to updateData if they exist
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'pasengercapacity') {
          updateData[field] = parseInt(req.body[field]) || 0;
        } else if (field === 'baseprice') {
          updateData[field] = parseFloat(req.body[field]) || 0;
        } else if (field === 'availabilitySchedule') {
          // Handle array fields
          if (typeof req.body[field] === 'string') {
            try {
              updateData[field] = JSON.parse(req.body[field]);
            } catch {
              updateData[field] = req.body[field];
            }
          } else {
            updateData[field] = req.body[field];
          }
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // Handle image update if a new file is uploaded
    if (req.file) {
      console.log('Processing new image for update');
      
      // Generate custom filename
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
      const fileExtension = path.extname(req.file.originalname) || '.jpg';
      const vehicleNumber = updateData.vehicalnumber || req.body.vehicalnumber;
      const cleanVehicleNumber = vehicleNumber ? vehicleNumber.replace(/[^a-zA-Z0-9]/g, '_') : 'vehicle';
      const customFilename = `${cleanVehicleNumber}_${formattedDate}${fileExtension}`;
      
      updateData.vehicalimage = {
        data: req.file.buffer, // Store binary data in MongoDB
        contentType: req.file.mimetype,
        filename: customFilename,
        originalname: req.file.originalname,
        size: req.file.size,
        uploadedAt: date
      };
    } else if (req.body.removeImage === 'true') {
      // If client wants to remove the image
      updateData.vehicalimage = null;
    }

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // If there's nothing to update
    if (Object.keys(updateData).length === 1 && updateData.updatedAt) {
      return res.status(400).json({
        message: 'No valid fields provided for update'
      });
    }

    console.log('Update data:', { ...updateData, vehicalimage: updateData.vehicalimage ? 'Image data present' : updateData.vehicalimage });

    // Check if vehicle exists and update
    const updatedVehical = await vehicalService.updateVehical(id, updateData);

    if (!updatedVehical) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    // Format response (don't send binary data)
    const vehicalResponse = {
      _id: updatedVehical._id,
      vehicalname: updatedVehical.vehicalname,
      category: updatedVehical.category,
      type: updatedVehical.type,
      vehicalnumber: updatedVehical.vehicalnumber,
      pasengercapacity: updatedVehical.pasengercapacity,
      location: updatedVehical.location,
      baseprice: updatedVehical.baseprice,
      vehicalstatus: updatedVehical.vehicalstatus,
      vehicalimage: updatedVehical.vehicalimage ? {
        filename: updatedVehical.vehicalimage.filename,
        size: updatedVehical.vehicalimage.size,
        contentType: updatedVehical.vehicalimage.contentType,
        url: `/api/vehicles/${updatedVehical._id}/image`
      } : null,
      availabilitySchedule: updatedVehical.availabilitySchedule,
      status: updatedVehical.status,
      createdAt: updatedVehical.createdAt,
      updatedAt: updatedVehical.updatedAt
    };

    res.status(200).json({
      message: 'Vehicle updated successfully',
      data: vehicalResponse
    });

  } catch (err) {
    handleVehicleError(err, res, next);
  }
}

async function deleteVehicle(req, res, next) {
  try {
    const { id } = req.params;
    
    const vehical = await vehicalService.deleteVehicle(id);
    
    if (!vehical) {
      return res.status(404).json({
        error: 'Vehicle not found'
      });
    }

    res.status(200).json({
      message: 'Vehicle deleted successfully',
      data: {
        id: vehical._id,
        vehicalname: vehical.vehicalname,
        vehicalnumber: vehical.vehicalnumber
      }
    });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid vehicle ID'
      });
    }
    
    next(err);
  }
}

// Get vehicle image - serves the binary data from MongoDB
async function getVehicleImage(req, res, next) {
  try {
    const vehicleId = req.params.id;
    
    if (!vehicleId) {
      return res.status(400).json({
        error: 'Vehicle ID is required'
      });
    }

    const vehicle = await vehicalService.getVehicaleById(vehicleId);
    
    if (!vehicle || !vehicle.vehicalimage || !vehicle.vehicalimage.data) {
      return res.status(404).json({
        error: 'Vehicle image not found'
      });
    }

    // Set response headers
    res.set({
      'Content-Type': vehicle.vehicalimage.contentType,
      'Content-Length': vehicle.vehicalimage.data.length,
      'Content-Disposition': `inline; filename="${vehicle.vehicalimage.filename}"`,
      'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
    });

    // Send the image buffer directly from MongoDB
    res.send(vehicle.vehicalimage.data);
  } catch (err) {
    console.error('Error retrieving vehicle image:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid vehicle ID'
      });
    }
    
    next(err);
  }
}

// Helper function to handle vehicle errors
function handleVehicleError(err, res, next) {
  console.error('Vehicle error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      details: err.message
    });
  }
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'File too large. Maximum size is 5MB'
    });
  }
  
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      message: 'Invalid file type. Only images (jpeg, jpg, png, gif, webp) are allowed'
    });
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate vehicle number or unique field violation'
    });
  }
  
  next(err);
}

module.exports = { 
  createVehical, 
  listVehicale, 
  getVehicaleById,
  updateVehical, 
  deleteVehicle,
  getVehicleImage,
  uploadSingle // Export the upload middleware for routes
};