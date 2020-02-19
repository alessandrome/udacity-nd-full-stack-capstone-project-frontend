import axios from 'axios';
const BASE_URL = process.env.VUE_APP_BASE_API_URL;

const requests = {
    /**
     * Get API request to get match list from API endpoint
     * @param auth0Id
     * @param data
     * @returns {Promise<AxiosResponse<T>>}
     */
    getUserInfo(auth0Id, data) {
        if (!data) data = {};
        return axios.
            get(`${BASE_URL}/user-auth0`, {params: Object.assign({}, data)});
    },
};

export default {
    namespaced: true,
    requests
}
