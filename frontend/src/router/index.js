import { createRouter, createWebHistory } from 'vue-router';
import RegisterForm from '../components/RegisterForm.vue';
import LoginForm from '../components/LoginForm.vue';
import ForgotPassword from '../components/ForgotPassword.vue';
import ResetPassword from '../components/ResetPassword.vue';
import dashboard from '../pages/Dashboard.vue';
const routes = [
    { path: '/', component: LoginForm },
    { path: '/register', component: RegisterForm },
    { path: '/login', component: LoginForm },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/reset-password', component: ResetPassword },
    { path: '/dashboard', component: dashboard },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
