// AxiosConfig.tsx
import axios from 'axios';

// Crea una instancia de axios con la configuración básica
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/',  // Aquí va la URL base de tu API
    timeout: 30000,  // Timeout en milisegundos
    headers: {
        'Content-Type': 'application/json',  // Tipo de contenido que estás enviando
    },
});
