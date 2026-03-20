const tourService = require('../services/tour.Service');

async function createTour(req, res, next) {
  try {
    console.log('Request body:', req.body)

    const tourData = {
      customer_id: req.body.Coustomer_id,
      tourname: req.body.tourname,
      description: req.body.description || '',
      locations: req.body.locations,
      passenger_count: req.body.passenger_count,
      totalprice: req.body.totalprice,
      tourSchedule: req.body.tourSchedule,
      starttime: req.body.starttime ,
      pickup_locations: req.body.pickup_locations || '',
      status: req.body.status || 'Active'
    }

    // Validate required fields
    if (!tourData.tourname || !tourData.description || !tourData.locations) {
      return res.status(400).json({
        message: 'Missing required fields: tourname, description, locations'
      })
    }

    // Parse tourSchedule if it's a string
    if (typeof tourData.tourSchedule === 'string') {
      try {
        tourData.tourSchedule = JSON.parse(tourData.tourSchedule);
      } catch (error) {
        // If it's already an array string format
        if (tourData.tourSchedule.includes('[')) {
          const cleanedString = tourData.tourSchedule
            .replace(/[\[\]"]/g, '')
            .split(',')
            .map(date => date.trim())
            .filter(date => date);
          tourData.tourSchedule = cleanedString;
        }
      }
    }
    
    // Ensure all dates are in YYYY-MM-DD format
    if (Array.isArray(tourData.tourSchedule)) {
      tourData.tourSchedule = tourData.tourSchedule.map(date => {
        // If it's a Date object
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        
        // If it's a string date
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString().split('T')[0];
        }
        
        // If it's already in YYYY-MM-DD format
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        
        throw new Error(`Invalid date format: ${date}`);
      });
    }


    const tour = await tourService.createTour(tourData)
   
    res.status(201).json({
      message: 'Tour created successfully',
    })
  
  } catch (err) {
    console.error('Error creating user:', err)

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

async function listTour(req, res, next) {
  try {
    const tours = await tourService.getAllTour()
    
    res.status(200).json({
      message: 'Tours retrieved successfully',
      data: tours
    })
  } catch (err) {
    console.error('Error retrieving Tours:', err)
    next(err)
  }
}

async function getTourById(req, res, next) {
   try {
     // Get ID from URL parameter OR query parameter
     const tourId = req.params.id || req.query.id;

     if (!tourId) {
       return res.status(400).json({
         error: 'Tour ID is required'
       });
     }

     const tour = await tourService.getTourById(tourId);   
     if (!tour) {
       return res.status(404).json({
         error: 'Tour not found'
       });
     }

     res.status(200).json({
       message: 'Tour retrieved successfully',
       data: tour
     });
   } catch (err) {
     console.error('Error retrieving tour:', err);
     if (err.name === 'CastError') {
       return res.status(400).json({
         error: 'Invalid tour ID'
       });
     }

     next(err);
   }
}

async function updateTour(req, res, next) {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({
        message: 'Vehicle ID is required'
      })
    }

    // Create update data object from request body
    const updateData = {}
    
   // Only include fields that are being updated
    const allowedFields = [
      'tourname',
      'description',
      'locations',
      'passenger_count',
      'totalprice',
      'tourSchedule',
      'starttime',
      'pickup_locations',
      'status'
    ]

    // Add fields from request body to updateData if they exist
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field]
      }
    })


    // Add updatedAt timestamp
    updateData.updatedAt = Date.now()

    // If there's nothing to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: 'No valid fields provided for update'
      })
    }

     // Parse tourSchedule if it's a string
    if (typeof updateData.tourSchedule === 'string') {
      try {
        updateData.tourSchedule = JSON.parse(updateData.tourSchedule);
      } catch (error) {
        // If it's already an array string format
        if (updateData.tourSchedule.includes('[')) {
          const cleanedString = updateData.tourSchedule
            .replace(/[\[\]"]/g, '')
            .split(',')
            .map(date => date.trim())
            .filter(date => date);
          updateData.tourSchedule = cleanedString;
        }
      }
    }
    
    // Ensure all dates are in YYYY-MM-DD format
    if (Array.isArray(updateData.tourSchedule)) {
      updateData.tourSchedule = updateData.tourSchedule.map(date => {
        // If it's a Date object
        if (date instanceof Date) {
          return date.toISOString().split('T')[0];
        }
        
        // If it's a string date
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toISOString().split('T')[0];
        }
        
        // If it's already in YYYY-MM-DD format
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        
        throw new Error(`Invalid date format: ${date}`);
      });
    }

    // Check if tour exists and update
    const updatedTour = await tourService.updateTour(id, updateData)

    if (!updatedTour) {
      return res.status(404).json({
        message: 'Tour not found'
      })
    }

    res.status(200).json({
      message: 'Tour updated successfully',
    })

  } catch (err) {
    console.error('Error updating tour:', err)

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

async function deleteTour(req, res, next) {
  try {
    const { id } = req.params;
    
    const tour = await tourService.deleteTour(id);
    
    if (!tour) {
      return res.status(404).json({
        error: 'Tour not found'
      });
    }

    res.status(200).json({
      message: 'Tour deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting tour:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid tour ID'
      });
    }
    
    next(err);
  }
}

async function listCustomersTour(req, res, next) {
  try {
    const customers = await tourService.getAllCustomer();
    

    res.status(200).json({
      message: 'Customers retrieved successfully',
      data: customers
    });
  } catch (err) {
    console.error('Error retrieving customers:', err);
    next(err);
  }
}


module.exports = { createTour, listTour, getTourById, updateTour, deleteTour ,listCustomersTour};