import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://ahorrosmart-finsyncbc-production.up.railway.app', // Cambia esto a la URL de tu backend
  timeout: 10000, // 10 segundos
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.warn('REQUEST');
    console.log(JSON.stringify(config, null, 2));
    return config;
  },
  (error) => {
    console.error('REQUEST ERROR');
    return Promise.reject(error);
  },
);


api.interceptors.response.use(
  (response) => {
    console.log('RESPONSE');
    console.log(JSON.stringify(response.data, null, 2));
    return response;
  },
  async (error: AxiosError) => {
    console.error('RESPONSE ERROR');
    console.log(JSON.stringify(error.response?.data, null, 2));

    if (error.response?.status === 401) {
      // Token inválido o expirado
      await AsyncStorage.removeItem('token');
      console.warn('Token eliminado. Redirigir al Login');
      // Aquí podrías redirigir al usuario al Login (opcional, según tu implementación de navegación)
    }

    if (error.response?.status === 500) {
      console.error('Error en el servidor');
      // Mostrar un mensaje de error genérico al usuario
    }

    return Promise.reject(error);
  },
);



export default api;
