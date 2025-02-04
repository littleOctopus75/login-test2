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
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña. El enlace expira en 60 minutos:</p>
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
        // 🔹 1️⃣ Buscar usuario en la base de datos
        const [user] = await pool.query('SELECT id, email, password FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // 🔹 2️⃣ Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // 🔹 3️⃣ Generar token JWT
        const token = jwt.sign(
            { id: user[0].id, email: user[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 📌 Capturar información del usuario
        const userAgent = req.headers['user-agent']; // Obtener el sistema operativo y navegador
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // IP del usuario
        const accessDate = new Date().toISOString(); // Fecha y hora del acceso

        // 📌 Guardar la información en una cookie
        res.cookie('accessInfo', JSON.stringify({ ip, accessDate, userAgent }), {
            httpOnly: true, // La cookie no puede ser accedida desde JS en el frontend
            secure: false, // Si usas HTTPS, ponlo en true
            sameSite: 'Lax',
            domain: 'localhost',
            path:'/',
            maxAge: 60 * 60 * 1000, // 1 hora de duración
        });

        // 🔹 4️⃣ Devolver los datos requeridos
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: {
                email: user[0].email, // Email del usuario
                password: user[0].password // Contraseña hasheada (para mostrar en el Dashboard)
            }
        });
        // res.status(200).json({ message: 'Inicio de sesión exitoso.', token });


    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
};
const logout = (req, res) => {
    res.clearCookie('accessInfo', { httpOnly: true, sameSite: 'Lax' });
    res.status(200).json({ message: 'Sesión cerrada con éxito.' });
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
// const resetPassword = async (req, res) => {
//     const { token, newPassword } = req.body;

//     try {
//         // Verificar si el token es válido
//         const [resetToken] = await pool.query(
//             'SELECT * FROM reset_tokens WHERE token = ? AND expires_at > NOW()',
//             [token]
//         );

//         if (resetToken.length === 0) {
//             return res.status(400).json({ message: 'Token inválido o expirado.' });
//         }

//         // Hashear la nueva contraseña
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Actualizar contraseña del usuario
//         await pool.query('UPDATE users SET password = ? WHERE id = ?', [
//             hashedPassword,
//             resetToken[0].user_id,
//         ]);

//         // Eliminar el token usado
//         await pool.query('DELETE FROM reset_tokens WHERE token = ?', [token]);

//         res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error al restablecer la contraseña.' });
//     }
// };

// restablecer contraseña con validaciones
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // 🔹 1️⃣ Buscar el token en la base de datos
        const [storedToken] = await pool.query('SELECT * FROM reset_tokens WHERE token = ?', [token]);

        if (storedToken.length === 0) {
            return res.status(400).json({ message: 'Token de recuperación inválido o ya fue utilizado.' });
        }

        const tokenData = storedToken[0];

        // 🔹 2️⃣ Verificar si el token ya expiró
        const now = new Date();
        const expirationTime = new Date(tokenData.expires_at); // Fecha de expiración en DB

        if (now > expirationTime) {
            return res.status(403).json({ message: 'El token de recuperación ha expirado. Solicita uno nuevo.' });
        }

        // 🔹 3️⃣ Verificar si la nueva contraseña es diferente a la anterior (al menos 2 caracteres distintos)
        const [user] = await pool.query('SELECT password FROM users WHERE id = ?', [tokenData.user_id]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const oldPassword = user[0].password;

        const diffChars = [...newPassword].filter((char, index) => char !== oldPassword[index]).length;

        if (diffChars <= 2) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 2 caracteres diferentes a la anterior.' });
        }

        // 🔹 4️⃣ Hashear la nueva contraseña y actualizar en la DB
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, tokenData.user_id]);

        // 🔹 5️⃣ Eliminar el token de recuperación para que no se use nuevamente
        await pool.query('DELETE FROM reset_tokens WHERE token = ?', [token]);

        res.status(200).json({ message: 'Contraseña actualizada con éxito.' });

    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};


const getOldPassword = async (req, res) => {
    const { token } = req.query;

    try {
        // Busca al usuario por el token (puedes cambiarlo según tu lógica)
        const [user] = await pool.query(
            'SELECT users.password FROM users JOIN reset_tokens ON users.id = reset_tokens.user_id WHERE reset_tokens.token = ?',
            [token]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado o token inválido' });
        }

        // Enviamos la contraseña encriptada (para que el frontend la compare)
        res.status(200).json({ oldPassword: user[0].password });

    } catch (error) {
        console.error('Error obteniendo la contraseña anterior:', error);
        res.status(500).json({ message: 'Error al obtener la contraseña anterior' });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    getOldPassword,
    logout
};

