const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const pool = require('./config/database');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
