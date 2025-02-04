import { defineStore } from 'pinia';
import api from '../api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        accessInfo: null // ✅ Nueva variable para almacenar info de acceso desde la cookie
    }),

    actions: {
        async login(email, password) {
            try {
                const response = await api.post('/login', { email, password }, { withCredentials: true });

                if (!response || !response.data) {
                    throw new Error('Respuesta del servidor no válida.');
                }

                this.token = response.data.token;
                this.user = response.data.user; // 🔹 Guardar info del usuario en el estado

                localStorage.setItem('token', this.token);
                localStorage.setItem('userData', JSON.stringify(this.user));

                // ✅ Llamada sin "await" para que no bloquee el flujo
                this.getAccessInfo();

                return response.data;
            } catch (error) {
                console.error('Error en el login:', error.response?.data || error.message);
                throw error.response?.data || 'Error al iniciar sesión.';
            }
        },

        async getAccessInfo() {
            try {
                const response = await api.get('/access-info', { withCredentials: true });

                if (!response || !response.data) {
                    throw new Error('No se pudo recuperar la información de acceso.');
                }

                this.accessInfo = response.data;
            } catch (error) {
                console.error('Error obteniendo la información de acceso:', error);
            }
        },

        async register(email, password) {
            try {
                const response = await api.post('/register', { email, password });

                if (!response || !response.data) {
                    throw new Error('Respuesta del servidor no válida.');
                }

                return response.data;
            } catch (error) {
                console.error('Error en el registro:', error.response?.data || error.message);
                throw error.response?.data || 'Error en el registro.';
            }
        },

        setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
        },

        logout() {
            this.token = null;
            this.user = null;
            this.accessInfo = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userData');

            // ✅ Elimina la cookie desde el backend
            api.post('/api/auth/logout', {}, { withCredentials: true })
                .catch(err => console.error('Error al cerrar sesión:', err));
        }
    }
});
