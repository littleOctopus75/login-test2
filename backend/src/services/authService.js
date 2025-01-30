import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = (email, password) =>
    axios.post(`${API_URL}/login`, { email, password });

export const register = (email, password, name) =>
    axios.post(`${API_URL}/register`, { email, password, name });

export const recoverPassword = (email) =>
    axios.post(`${API_URL}/recover-password`, { email });
