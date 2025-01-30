const express = require('express');
const {forgotPassword} = require('../../controllers/authController');
const router = express.Router();

// Ruta para solicitar recuperación de contraseña
router.post('/', forgotPassword);

module.exports = router;
