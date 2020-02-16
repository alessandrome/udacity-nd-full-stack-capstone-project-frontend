import axios from 'axios';
const BASE_URL = process.env.VUE_APP_BASE_API_URL;

const requests = {
    /**
     * Get API request to get match list from API endpoint
     * @param data
     * @param filters
     * @param page
     * @param perPage
     * @returns {Promise<AxiosResponse<T>>}
     */
    getGames(data, filters, page, perPage) {
        return axios.
            get(`${BASE_URL}/games`, {params: Object.assign({}, data, filters, {page, perPage})});
    }
};

export default {
    namespaced: true,
    requests
}