import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.60.178:3000', // Altere para a URL do seu backend
});

export default api;