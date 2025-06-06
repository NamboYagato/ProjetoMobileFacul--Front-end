import axios from 'axios';

const api = axios.create({
  baseURL: 'https://menuup-back-end.onrender.com'
});

export default api;
