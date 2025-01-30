<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';

const route = useRoute();
const router = useRouter();

const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const errorMessage = ref('');
const token = ref('');
const loading = ref(false);

onMounted(() => {
    token.value = route.query.token || '';
});

const resetPassword = async () => {
    if (!token.value) {
        errorMessage.value = 'El token de recuperación no es válido.';
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Las contraseñas no coinciden.';
        return;
    }

    message.value = '';
    errorMessage.value = '';
    loading.value = true;

    try {
        const response = await api.post('/reset-password', {
            token: token.value,
            newPassword: newPassword.value,
        });
        message.value = response.data.message;
        setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Error al restablecer la contraseña.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="reset-container">
        <div class="reset-box">
            <h2>Restablecer Contraseña</h2>
            <p class="instructions">
                Ingresa una nueva contraseña y confírmala para continuar.
            </p>
            <input v-model="newPassword" placeholder="Nueva Contraseña" type="password" class="input-field" />
            <input v-model="confirmPassword" placeholder="Confirmar Contraseña" type="password" class="input-field" />
            <button @click="resetPassword" :disabled="loading" class="reset-button">
                {{ loading ? 'Restableciendo...' : 'Restablecer Contraseña' }}
            </button>
            <p v-if="message" class="success-message">{{ message }}</p>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
    background: linear-gradient(to right, #2193b0, #6dd5ed);
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
    border: 1px solid #2193b0;
    outline: none;
}

/* Botón de restablecer */
.reset-button {
    width: 100%;
    padding: 10px;
    background: #2193b0;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.reset-button:hover {
    background: #17657e;
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
    color: red;
    font-size: 14px;
    margin-top: 10px;
}
</style>
