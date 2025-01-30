const express = require('express');
const {resetPassword} = require('../../controllers/authController');
const router = express.Router();

// Ruta para restablecer contraseña
router.post('/', resetPassword);

module.exports = router;
