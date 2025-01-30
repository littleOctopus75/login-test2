<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const register = async () => {
    try {
        await authStore.register(email.value, password.value);
        await router.push('/login');
        alert("Usuario creado con éxito");
    } catch (error) {
        errorMessage.value = error.message;
    }
};
</script>

<template>
    <div class="register-container">
        <div class="register-box">
            <h2>Registro</h2>
            <input v-model="email" placeholder="Correo electrónico" type="email" class="input-field" />
            <input v-model="password" placeholder="Contraseña" type="password" class="input-field" />
            <button @click="register" class="register-button">Registrarse</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p></p>
            <RouterLink to="/login" class="register-link">Iniciar sesion</RouterLink>

        </div>
    </div>
</template>

<style scoped>
/* Fondo con degradado */
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #6a11cb, #2575fc);
}

/* Caja del formulario */
.register-box {
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

/* Botón de registro */
.register-button {
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

.register-button:hover {
    background: #0056b3;
}

/* Mensaje de error */
.error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
}
</style>
