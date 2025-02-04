const express = require('express');
const {logout} = require('../../controllers/authController');
const router = express.Router();

// Ruta para solicitar recuperación de contraseña
router.post('/', logout);

module.exports = router;
