import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/auth', // Asegúrate de que esta URL es correcta
});

export default api; // 🔥 IMPORTANTE: Exportar como default
