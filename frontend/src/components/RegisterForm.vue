<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const emailError = ref('');
const passwordStrength = ref(0);
const passwordErrors = ref([]);

// Función para validar el correo electrónico
const validateEmail = computed(() => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.value)) {
        emailError.value = "El correo electrónico no es válido.";
        return false;
    }
    emailError.value = "";
    return true;
});

// Función para validar la contraseña
const validatePassword = computed(() => {
    const pass = password.value;
    let strength = 0;
    let errors = [];

    if (pass.length < 8) errors.push("Debe tener al menos 8 caracteres.");
    if (pass.length > 20) errors.push("No debe exceder los 20 caracteres.");
    if (!/[A-Z]/.test(pass)) errors.push("Debe incluir al menos una letra mayúscula.");
    if (!/[a-z]/.test(pass)) errors.push("Debe incluir al menos una letra minuscula.");
    if (!/\d/.test(pass)) errors.push("Debe contener al menos un número.");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pass)) errors.push("Debe incluir al menos un carácter especial (!, @, #, etc.).");

    passwordErrors.value = errors;

    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[!@#$%^&*(),.?\":{}|<>]/.test(pass)) strength++;

    passwordStrength.value = strength;

    if (strength === 0) return "La contraseña es muy débil.";
    if (strength < 3) return "La contraseña es débil.";
    if (strength < 4) return "La contraseña es moderada.";
    return "La contraseña es segura.";
});

const register = async () => {
    if (!validateEmail.value) {
        errorMessage.value = "Por favor, ingresa un correo válido.";
        return;
    }
    if (passwordErrors.value.length > 0) {
        errorMessage.value = "La contraseña no cumple con los siguientes requisitos:";
        return;
    }

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

            <!-- Input de correo electrónico con validación -->
            <input v-model="email" placeholder="Correo electrónico" type="email" class="input-field" />
            <p v-if="emailError" class="email-error">{{ emailError }}</p>

            <!-- Input de contraseña con validaciones dinámicas -->
            <input v-model="password" placeholder="Contraseña" type="password" class="input-field" />

            <!-- Indicador de seguridad de la contraseña -->
            <div class="password-strength">
                <div class="strength-bar" :class="['strength-' + passwordStrength]"></div>
            </div>
            <p class="strength-text">{{ validatePassword }}</p>

            <!-- Lista de errores dinámicos -->
            <ul class="password-errors" v-if="passwordErrors.length > 0">
                <li v-for="(error, index) in passwordErrors" :key="index">{{ error }}</li>
            </ul>

            <button @click="register" class="register-button">Registrarse</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

            <RouterLink to="/login" class="register-link">Iniciar sesión</RouterLink>
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

/* Mensaje de error en correo */
.email-error {
    font-size: 14px;
    color: red;
    text-align: left;
}

/* Indicador de seguridad de la contraseña */
.password-strength {
    width: 100%;
    height: 5px;
    background: #ddd;
    border-radius: 3px;
    margin: 5px 0;
    overflow: hidden;
}

/* Barra de fortaleza de la contraseña */
.strength-bar {
    height: 100%;
    width: 0%;
    transition: width 0.3s ease-in-out;
}

/* Colores de la barra según fortaleza */
.strength-1 { width: 25%; background: red; }
.strength-2 { width: 50%; background: orange; }
.strength-3 { width: 75%; background: yellowgreen; }
.strength-4 { width: 100%; background: green; }

/* Mensaje de seguridad */
.strength-text {
    font-size: 14px;
    color: #555;
}

/* Lista de errores */
.password-errors {
    text-align: left;
    font-size: 14px;
    color: red;
    list-style: none;
    padding: 0;
}

.password-errors li {
    margin: 5px 0;
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
