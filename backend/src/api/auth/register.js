const express = require('express');
const { register } = require('../../controllers/authController');
const router = express.Router();

// Ruta para registrar usuarios
router.post('/', register);

module.exports = router;
