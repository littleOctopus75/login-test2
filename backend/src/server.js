const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes'); // Agrupador de rutas de autenticación

dotenv.config();

const app = express();
// 🔥 Habilitar CORS
app.use(cors({
    origin: 'http://localhost:5173', // Permitir solicitudes desde el frontend
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true 
}));


app.use(express.json());
app.use(cookieParser()); // Middleware para manejar cookies

// Montar las rutas de autenticación
app.use('/api/auth', authRoutes);

// Configurar el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
