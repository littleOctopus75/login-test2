const express = require('express');
const registerRoutes = require('../api/auth/register.js'); // Ruta de registro
const loginRoutes = require('../api/auth/login'); // Ruta de inicio de sesión
const forgotPasswordRoutes = require('../api/auth/forgotPassword'); // Ruta para recuperación de contraseña
const resetPasswordRoutes = require('../api/auth/resetPassword'); // Ruta para restablecer contraseña

const router = express.Router();

// Montar las rutas
router.use('/register', registerRoutes); // Maneja /api/auth/register
router.use('/login', loginRoutes); // Maneja /api/auth/login
router.use('/forgot-password', forgotPasswordRoutes); // Maneja /api/auth/forgot-password
router.use('/reset-password', resetPasswordRoutes); // Maneja /api/auth/reset-password

module.exports = router;
