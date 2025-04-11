// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Troque pelo IP/URL do seu servidor
});

export default api;
