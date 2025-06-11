import axios from 'axios';

export const axiosInstanceBackendUsuarios = axios.create({
    baseURL: 'http://localhost:8080/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const axiosInstanceBackend_AI_Ejercicios = axios.create({
    baseURL: 'http://localhost:8000/',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});
