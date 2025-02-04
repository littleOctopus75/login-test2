<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

// Función para establecer el token y tiempo de expiración (5 minutos)
const setSession = (token, user) => {
    const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutos en milisegundos
    localStorage.setItem('authToken', token);
    localStorage.setItem('authExpiration', expirationTime);
    localStorage.setItem('userData', JSON.stringify({
        email: user.email, // Correo del usuario
        password: user.password // Contraseña hasheada
    }));
};

// Función para verificar si la sesión sigue activa
const checkSession = () => {
    const token = localStorage.getItem('authToken');
    const expirationTime = localStorage.getItem('authExpiration');

    if (token && expirationTime) {
        const currentTime = new Date().getTime();
        if (currentTime > expirationTime) {
            logout(); // Expiró la sesión, eliminar datos y redirigir al login
        } else {
            authStore.setToken(token); // Si es válido, mantener la sesión
            router.push('/dashboard'); // Redirigir al dashboard si está autenticado
        }
    }
};

// Función para cerrar sesión
const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authExpiration');
    localStorage.removeItem('userData');
    authStore.logout();
    router.push('/login');
};

// Función de login
const login = async () => {
    try {
        const response = await authStore.login(email.value, password.value);
        if (!response.user) {
            throw new Error('Datos del usuario no disponibles.');
        }
        // 🔹 Guardamos el usuario en localStorage
        const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutos
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authExpiration', expirationTime);
        localStorage.setItem('userData', JSON.stringify({
            email: response.user.email, // Correo del usuario ✅
            password: response.user.password // Contraseña hasheada
        }));
        await router.push('/dashboard');


    } catch (error) {
        errorMessage.value = error.message;
    }
};

// Verifica si la sesión sigue activa cuando se carga el componente
onMounted(() => {
    checkSession();
});
</script>

<template>
    <div class="login-container">
        <div class="login-box">
            <h2>Iniciar Sesión</h2>
            <input v-model="email" placeholder="Correo electrónico" type="email" class="input-field" />
            <input v-model="password" placeholder="Contraseña" type="password" class="input-field" />
            <button @click="login" class="login-button">Ingresar</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <p class="register-text">
                ¿No tienes una cuenta?
                <RouterLink to="/register" class="register-link">Regístrate aquí</RouterLink>
            </p>

            <RouterLink to="/forgot-password" class="forgot-password">¿Olvidaste tu contraseña?</RouterLink>
        </div>
    </div>
</template>

<style scoped>
/* Fondo con degradado */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #0072ff, #00c6ff);
}

/* Caja del formulario */
.login-box {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 350px;
}

/* Estilos para los inputs */
.input-field {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    transition: border 0.3s;
}

.input-field:focus {
    border: 1px solid #007bff;
    outline: none;
}

/* Botón de inicio de sesión */
.login-button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.login-button:hover {
    background: #0056b3;
}

/* Mensaje de error */
.error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
}

/* Texto y enlace para registrarse */
.register-text {
    font-size: 14px;
    margin-top: 10px;
    color: #333;
}

.register-link {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
}

.register-link:hover {
    color: #0056b3;
}

/* Enlace para recuperar contraseña */
.forgot-password {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    color: #007bff;
    text-decoration: none;
    transition: color 0.3s;
}

.forgot-password:hover {
    color: #0056b3;
}
</style>
