const express = require('express');
const router = express.Router();
const vehicalCtrl = require('../controllers/vehical.Controller');
const { authenticateToken } = require('../middleware/authMiddleware');

const multer = require('multer');

const upload = multer();

router.post('/create', authenticateToken, upload.single('vehicalimage'), vehicalCtrl.createVehical);
router.get('/all', authenticateToken, vehicalCtrl.listVehicale);
router.get('/:id?', authenticateToken, vehicalCtrl.getVehicaleById);
router.post('/update', authenticateToken, upload.single('vehicalimage'), vehicalCtrl.updateVehical);
router.delete('/:id', authenticateToken, vehicalCtrl.deleteVehicle);

// Image route - THIS IS IMPORTANT!
router.get('/vehicles/:id/image', vehicalCtrl.getVehicleImage);

module.exports = router; 