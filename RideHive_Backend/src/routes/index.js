const express = require('express');
const router = express.Router();

// Import all routes
const userRoutes = require('./user.routes');
const authRoutes = require('./user.routes');

const vehicalRoutes = require('./vehical.route');
const tourRoutes = require('./tour.routes');
const bookingRoutes = require('./booking.routes');

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes); 

router.use('/vehicals', vehicalRoutes);

router.use('/tours', tourRoutes);
router.use('/bookings', bookingRoutes);
module.exports = router;