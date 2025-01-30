<script setup>
import { ref } from 'vue';
import api from '../api'; // Archivo que contiene la configuración de Axios

const email = ref('');
const message = ref('');
const errorMessage = ref('');
const loading = ref(false);

const sendResetEmail = async () => {
    message.value = '';
    errorMessage.value = '';
    loading.value = true;

    try {
        const response = await api.post('/forgot-password', { email: email.value });
        message.value = response.data.message;
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Error al solicitar la recuperación de contraseña.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="reset-container">
        <div class="reset-box">
            <h2>Recuperar Contraseña</h2>
            <p class="instructions">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
            <input v-model="email" placeholder="Correo electrónico" type="email" class="input-field" />
            <button @click="sendResetEmail" :disabled="loading" class="reset-button">
                {{ loading ? 'Enviando...' : 'Enviar Enlace de Recuperación' }}
            </button>
            <p v-if="message" class="success-message">{{ message }}</p>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p></p>
            <RouterLink to="/login" class="register-link">Iniciar sesión</RouterLink>

        </div>
    </div>
</template>

<style scoped>
/* Fondo con degradado */
.reset-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #6a11cb, #2575fc);
}

/* Caja del formulario */
.reset-box {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 100%;
    max-width: 350px;
}

/* Texto de instrucciones */
.instructions {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
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

/* Botón de envío */
.reset-button {
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

.reset-button:hover {
    background: #007bff;
}

/* Botón en estado deshabilitado */
.reset-button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

/* Mensaje de éxito */
.success-message {
    color: green;
    font-size: 14px;
    margin-top: 10px;
}

/* Mensaje de error */
.error-message {
    color: 007bff;
    font-size: 14px;
    margin-top: 10px;
}
</style>
