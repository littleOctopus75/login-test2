import { defineStore } from 'pinia';
import api from '../api';

import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                this.token = response.data.token;
                localStorage.setItem('token', this.token);
                return response.data;
            } catch (error) {
                throw error.response.data;
            }
        },
        async register(email, password) {
            try {
                // await axios.post('http://localhost:5000/api/auth/register', { email, password });
                const response = await api.post('/register', { email, password });
                // 🔥 Verifica que response existe antes de acceder a .data
                if (!response || !response.data) {
                    throw new Error('Respuesta del servidor no válida.');
                }
                return response.data; // Asegurar que se devuelve data
            } catch (error) {
                console.error('Error en el registro:', error.response?.data || error.message);
                throw error.response.data;
            }
        },
        logout() {
            this.token = null;
            localStorage.removeItem('token');
        },
    },
});
