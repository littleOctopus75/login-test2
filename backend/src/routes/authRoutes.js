const express = require('express');
const registerRoutes = require('../api/auth/register.js'); // Ruta de registro
const loginRoutes = require('../api/auth/login'); // Ruta de inicio de sesión
const forgotPasswordRoutes = require('../api/auth/forgotPassword'); // Ruta para recuperación de contraseña
const resetPasswordRoutes = require('../api/auth/resetPassword'); // Ruta para restablecer contraseña
const logout = require('../api/auth/logout'); // Ruta para restablecer contraseña

const { getOldPassword } = require('../controllers/authController'); // Controlador para obtener la contraseña anterior

const router = express.Router();

// Montar las rutas
router.use('/register', registerRoutes); // Maneja /api/auth/register
router.use('/login', loginRoutes); // Maneja /api/auth/login
router.use('/forgot-password', forgotPasswordRoutes); // Maneja /api/auth/forgot-password
router.use('/reset-password', resetPasswordRoutes); // Maneja /api/auth/reset-password
router.post('/logout', logout);
router.get('/get-old-password', getOldPassword); // Nueva ruta
router.get('/access-info', (req, res) => {
    const accessInfo = req.cookies.accessInfo;
    if (!accessInfo) {
        return res.status(404).json({ message: 'No hay información de acceso almacenada.' });
    }
    res.json(JSON.parse(accessInfo));
});
module.exports = router;
