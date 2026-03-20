const express = require('express');
const router = express.Router();
const tourCtrl = require('../controllers/tour.Controller');
const { authenticateToken } = require('../middleware/authMiddleware');

const multer = require('multer');

const upload = multer();

router.post('/create', authenticateToken, upload.none(), tourCtrl.createTour);
router.get('/customerlist', authenticateToken, tourCtrl.listCustomersTour);
router.get('/all', authenticateToken, tourCtrl.listTour);
router.get('/:id?', authenticateToken, tourCtrl.getTourById);
router.post('/update', authenticateToken, upload.none(), tourCtrl.updateTour);
router.delete('/:id', authenticateToken, tourCtrl.deleteTour);

module.exports = router;