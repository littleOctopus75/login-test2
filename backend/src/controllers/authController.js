const bcrypt = require('bcrypt');
const pool = require('../config/database');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        console.log("Recibida solicitud de recuperación para:", email);

        // Verificar si el usuario existe
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            console.log("Usuario no encontrado en la base de datos.");

            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Generar token único
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hora de vigencia

        // Guardar el token en la base de datos
        await pool.query('INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [
            user[0].id,
            token,
            expiresAt,
        ]);
        console.log("Token generado y almacenado:", token);

        // Configurar el envío de email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log("Configuración de transporte creada, preparando correo...");


        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Restablecer Contraseña',
            html: `<p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetLink}">Restablecer Contraseña</a>`,
        });

        console.log("Correo enviado con éxito.");

        res.status(200).json({ message: 'Email de recuperación enviado.' });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ message: 'Error al enviar el email de recuperación.' });
    }
};

const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log("Datos recibidos:", { email, password });

        // Validar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        console.log("Usuario existente:", existingUser);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Contraseña hasheada:", hashedPassword);

        // Crear usuario
        await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        console.log("Usuario registrado con éxito.");

        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
};

// Inicio de sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user[0].id, email: user[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
};

// Verificar token de restablecimiento
const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Verificar si el token es válido y no ha expirado
        const [resetToken] = await pool.query(
            'SELECT * FROM reset_tokens WHERE token = ? AND expires_at > NOW()',
            [token]
        );

        if (resetToken.length === 0) {
            return res.status(400).json({ message: 'Token inválido o expirado.' });
        }

        res.status(200).json({ message: 'Token válido.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar el token.' });
    }
};

// Restablecer contraseña
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verificar si el token es válido
        const [resetToken] = await pool.query(
            'SELECT * FROM reset_tokens WHERE token = ? AND expires_at > NOW()',
            [token]
        );

        if (resetToken.length === 0) {
            return res.status(400).json({ message: 'Token inválido o expirado.' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña del usuario
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [
            hashedPassword,
            resetToken[0].user_id,
        ]);

        // Eliminar el token usado
        await pool.query('DELETE FROM reset_tokens WHERE token = ?', [token]);

        res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyResetToken,
    resetPassword,
};

