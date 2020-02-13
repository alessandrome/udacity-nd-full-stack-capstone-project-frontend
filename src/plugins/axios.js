import axios from 'axios';
import vueInstance from '@/main.js'

axios.interceptors.request.use(
    async (config) => {
        let token = await vueInstance.$auth.getTokenSilently();
        console.log({token})
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