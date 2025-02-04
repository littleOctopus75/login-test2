<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const accessInfo = ref({
    ip: 'Cargando...',
    accessDate: 'Cargando...',
    userAgent: 'Cargando...'
});
const userEmail = ref('Cargando...');
const sessionTimeLeft = ref(0);
let interval = null;

// 🔹 Obtener la información de acceso desde la API
const getAccessInfo = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/access-info', { withCredentials: true });
        accessInfo.value = response.data;
    } catch (error) {
        console.error('Error obteniendo la información de acceso:', error.response?.data || error.message);
    }
};

// 🔹 Obtener el correo electrónico desde localStorage
const getUserEmail = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    userEmail.value = userData?.email || 'No disponible';
};

// 🔹 Obtener el tiempo restante de la sesión desde localStorage
const updateSessionTime = () => {
    const expiration = localStorage.getItem('authExpiration');
    if (!expiration) {
        logout();
        return;
    }

    const currentTime = new Date().getTime();
    sessionTimeLeft.value = Math.max(0, Math.floor((expiration - currentTime) / 1000)); // Tiempo en segundos

    if (sessionTimeLeft.value === 0) {
        logout(); // Expiró la sesión
    }
};

// 🔹 Cerrar sesión y redirigir al login
const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authExpiration');
    localStorage.removeItem('userData');
    clearInterval(interval);
    router.push('/login');
};

// 🔹 Formatear la fecha para que sea más legible
const formatDate = (dateString) => {
    if (!dateString || dateString === 'Cargando...') return 'No disponible';

    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// 🔹 Obtener la IP pública del usuario
const getPublicIP = async () => {
    try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        accessInfo.value.ip = data.ip;
    } catch (error) {
        console.error('Error obteniendo la IP pública:', error);
    }
};

// 🔹 Obtener y formatear el sistema operativo y navegador
const parseUserAgent = (userAgent) => {
    if (!userAgent || userAgent === 'Cargando...') return 'No disponible';

    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const os = osMatch ? osMatch[1].split(';')[0] : 'Desconocido';

    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari)\/(\d+)/);
    const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Navegador desconocido';

    return `${os} - ${browser}`;
};

// 🔹 Iniciar la actualización del tiempo de sesión y datos al montar el componente
onMounted(() => {
    getUserEmail();
    getPublicIP();
    getAccessInfo();
    updateSessionTime();
    interval = setInterval(updateSessionTime, 1000); // Actualiza cada segundo
});

// 🔹 Limpiar intervalo cuando el componente se desmonta
onUnmounted(() => {
    clearInterval(interval);
});
</script>

<template>
    <div class="dashboard-container">
        <div class="dashboard-box">
            <h2 class="welcome-text">Bienvenido</h2>

            <div class="info-section">
                <p><strong>Correo Electrónico:</strong> <span>{{ userEmail }}</span></p>
                <p><strong>IP:</strong> <span>{{ accessInfo.ip }}</span></p>
                <p><strong>Fecha de Acceso:</strong> <span>{{ formatDate(accessInfo.accessDate) }}</span></p>
                <p><strong>Sistema Operativo y Navegador:</strong> <span>{{ parseUserAgent(accessInfo.userAgent) }}</span></p>
                <p><strong>Tiempo restante de sesión:</strong> 
                    <span v-if="sessionTimeLeft > 0">
                        {{ Math.floor(sessionTimeLeft / 60) }} min {{ sessionTimeLeft % 60 }} seg
                    </span>
                    <span v-else style="color: red;">Sesión expirada</span>
                </p>
            </div>

            <button @click="logout" class="logout-button">Cerrar Sesión</button>
        </div>
    </div>
</template>

<style scoped>
/* 🔹 Fondo con degradado */
.dashboard-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #6a11cb, #2575fc);
}

/* 🔹 Caja de información */
.dashboard-box {
    background: white;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    text-align: center;
}

/* 🔹 Texto de bienvenida */
.welcome-text {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
}

/* 🔹 Sección de información */
.info-section {
    font-size: 1rem;
    color: #555;
}

.info-section p {
    margin: 10px 0;
}

.info-section strong {
    color: #222;
}

/* 🔹 Estilizar los valores */
.info-section span {
    color: #007bff;
    font-weight: bold;
}

/* 🔹 Botón de cerrar sesión */
.logout-button {
    width: 100%;
    padding: 10px;
    background: #ff4d4d;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
    margin-top: 20px;
}

.logout-button:hover {
    background: #cc0000;
}
</style>
