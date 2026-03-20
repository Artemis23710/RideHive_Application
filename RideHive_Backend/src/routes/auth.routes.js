const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.Controller');
const multer = require('multer');

const upload = multer();


router.post('/login', upload.none(), authCtrl.login);

module.exports = router;