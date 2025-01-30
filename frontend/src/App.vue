<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { useAuthStore } from './store/authStore';

const authStore = useAuthStore();
</script>

<template>
    <div class="app-container">
        <main>
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
.app-container {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: auto;
    padding: 20px;
    text-align: center;
}

.navbar {
    display: flex;
    justify-content: center;
    gap: 15px;
    background: #007bff;
    padding: 10px;
    border-radius: 5px;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: bold;
}

.logout-button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
}
.logout-button:hover {
    background: #c82333;
}
</style>
