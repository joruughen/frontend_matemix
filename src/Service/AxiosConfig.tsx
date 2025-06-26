import axios from 'axios';

export const axiosInstanceBackendUsuarios = axios.create({
    baseURL: 'http://52.206.13.161:8090/',  
    headers: {
        'Content-Type': 'application/json',  
    },
});

export const axiosInstanceBackend_AI_Ejercicios = axios.create({
    baseURL: 'http://52.206.13.161:8000/',  
    headers: {
        'Content-Type': 'application/json', 
    },
});

export const axiosInstanceChat = axios.create({
    baseURL: 'http://52.206.13.161:8030/',  
    headers: {
        'Content-Type': 'application/json', 
    },
})