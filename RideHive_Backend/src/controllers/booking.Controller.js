const bookingService = require('../services/booking.Service');

async function createBooking(req, res, next) {
  try {
    console.log('Request body:', req.body)

    const bookingData = {
      customer_id: req.body.customer_id,
      vehicle_id: req.body.vehicle_id,
      tour_id: req.body.tour_id,
      driver_id: req.body.driver_id,
      booking_type: req.body.booking_type,
      booking_name: req.body.booking_name,
      description: req.body.description,
      bookingprice: req.body.bookingprice,
      booking_date: req.body.booking_date,
      bookingstatus: req.body.bookingstatus || 'Pending',
      status: req.body.status || 'Active'
    }

    // Validate required fields
    if (!bookingData.booking_name || !bookingData.description || !bookingData.booking_date) {
      return res.status(400).json({
        message: 'Missing required fields: booking_name, description, booking_date'
      })
    }

    const booking = await bookingService.createBooking(bookingData)
   
    res.status(201).json({
      message: 'Booking created successfully',
    })
  
  } catch (err) {
    console.error('Error creating booking:', err)

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

async function listBookings(req, res, next) {
  try {
    const bookings = await bookingService.getAllBookings()
    
    res.status(200).json({
      message: 'Bookings retrieved successfully',
      data: bookings
    })
  } catch (err) {
    console.error('Error retrieving Tours:', err)
    next(err)
  }
}

async function getBookingById(req, res, next) {
   try {
     // Get ID from URL parameter OR query parameter
     const bookingId = req.params.id || req.query.id;

     if (!bookingId) {
       return res.status(400).json({
         error: 'Booking ID is required'
       });
     }

     const booking = await bookingService.getBookingById(bookingId);   
     if (!booking) {
       return res.status(404).json({
         error: 'Booking not found'
       });
     }

     res.status(200).json({
       message: 'Booking retrieved successfully',
       data: booking
     });
   } catch (err) {
     console.error('Error retrieving booking:', err);
     if (err.name === 'CastError') {
       return res.status(400).json({
         error: 'Invalid booking ID'
       });
     }

     next(err);
   }
}

async function updateBooking(req, res, next) {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({
        message: 'Booking ID is required'
      })
    }

    const updateData = {}
    
   // Only include fields that are being updated
    const allowedFields = [
      'customer_id',
      'vehicle_id',
      'tour_id',
      'driver_id',
      'booking_type',
      'booking_name',
      'description',
      'bookingprice',
      'booking_date',
      'bookingstatus',
      'status'
    ]

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

    // Check if tour exists and update
    const updatebooking = await bookingService.updateBooking(id, updateData)

    if (!updatebooking) {
      return res.status(404).json({
        message: 'Booking not found'
      })
    }

    res.status(200).json({
      message: 'Booking updated successfully',
    })

  } catch (err) {
    console.error('Error updating Booking:', err)

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

async function deleteBooking(req, res, next) {
  try {
    const { id } = req.params;
    
    const booking = await bookingService.deleteBooking(id);
    
    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    res.status(200).json({
      message: 'Booking deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting booking:', err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid booking ID'
      });
    }
    
    next(err);
  }
}

async function listDriverBooking(req, res, next) {
  try {
    const drivers = await bookingService.getAllDriver();
    
    res.status(200).json({
      message: 'Drivers retrieved successfully',
      data: drivers
    });
  } catch (err) {
    console.error('Error retrieving customers:', err);
    next(err);
  }
}

module.exports = { createBooking, listBookings, getBookingById, updateBooking, deleteBooking, listDriverBooking };