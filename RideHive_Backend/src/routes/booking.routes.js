const express = require('express');
const router = express.Router();
const bookingCtrl = require('../controllers/booking.Controller');
const { authenticateToken } = require('../middleware/authMiddleware');

const multer = require('multer');

const upload = multer();

router.post('/create', authenticateToken, upload.none(), bookingCtrl.createBooking);
router.get('/driverlist', authenticateToken, bookingCtrl.listDriverBooking);
router.get('/all', authenticateToken, bookingCtrl.listBookings);
router.get('/:id?', authenticateToken, bookingCtrl.getBookingById);
router.post('/update', authenticateToken, upload.none(), bookingCtrl.updateBooking);
router.delete('/:id', authenticateToken, bookingCtrl.deleteBooking);
module.exports = router;