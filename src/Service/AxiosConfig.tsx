import axios from 'axios';

export const axiosInstanceBackendUsuarios = axios.create({
    baseURL: 'http://math-tutor-elb-494669186.us-east-1.elb.amazonaws.com:8090/',  
    headers: {
        'Content-Type': 'application/json',  
    },
});

export const axiosInstanceBackend_AI_Ejercicios = axios.create({
    baseURL: 'http://math-tutor-elb-494669186.us-east-1.elb.amazonaws.com:8000/',  
    headers: {
        'Content-Type': 'application/json', 
    },
});

export const axiosInstanceChat = axios.create({
    baseURL: 'http://math-tutor-elb-494669186.us-east-1.elb.amazonaws.com:8030/',  
    headers: {
        'Content-Type': 'application/json', 
    },
})