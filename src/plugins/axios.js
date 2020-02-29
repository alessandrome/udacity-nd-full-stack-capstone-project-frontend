import axios from 'axios';
import vueInstance from '@/main.js'

axios.interceptors.request.use(
    async (config) => {
        let token
        try {
            token = await vueInstance.$auth.getTokenSilently();
        } catch (e) {
            token = null;
        }
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

export default axios;