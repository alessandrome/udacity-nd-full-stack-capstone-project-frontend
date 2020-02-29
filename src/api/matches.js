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
    getMatches(data, filters, page, perPage) {
        return axios.
            get(`${BASE_URL}/matches`, {props: Object.assign({}, data, filters, {page, perPage})});
    },
    getMatch(uuid) {
        return axios.
            get(`${BASE_URL}/matches/${uuid}`);
    },
    createMatch(data) {
        return axios.
            post(`${BASE_URL}/matches`, Object.assign({}, data));
    },
    patchMatch(matchId, action, data) {
        data = data || {};
        return axios.
            patch(`${BASE_URL}/matches/${matchId}`, Object.assign({}, data, {action}));
    },
    /**
     *
     * @param matchId
     * @param joined {1|0}
     */
    getMatchUsers(matchId, joined = 1) {
        return axios.
            get(`${BASE_URL}/matches/${matchId}/users`, {params: Object.assign({}, {joined})});
    }
};

export default {
    namespaced: true,
    requests
}