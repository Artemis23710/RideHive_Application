const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.Controller');
const multer = require('multer');

const upload = multer();

// User routes
router.post('/create', upload.none(), userCtrl.createUser);
router.get('/all', userCtrl.listUsers);
router.get('/:id?', userCtrl.getUserById);
router.post('/update', upload.none(), userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

router.post('/login', upload.none(), authCtrl.login);
router.post('/register', upload.none(), userCtrl.RegisterUser);

module.exports = router;