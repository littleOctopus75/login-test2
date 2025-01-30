const express = require('express');
const {    login
} = require('../../controllers/authController');
const router = express.Router();

// Ruta para iniciar sesión
router.post('/', login);

module.exports = router;
