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
    getTournaments(data, filters, page, perPage) {
        return axios.
            get(`${BASE_URL}/tournaments`, {props: Object.assign({}, data, filters, {page, perPage})});
    },
    getTournament(uuid) {
        return axios.
            get(`${BASE_URL}/tournaments/${uuid}`);
    },
    createTournament(data) {
        return axios.
            post(`${BASE_URL}/tournaments`, Object.assign({}, data));
    },
    patchTournament(tournamentId, action, data) {
        data = data || {};
        return axios.
            patch(`${BASE_URL}/tournaments/${tournamentId}`, Object.assign({}, data, {action}));
    },
    deleteTournament(tournamentId) {
        return axios.
            delete(`${BASE_URL}/tournaments/${tournamentId}`);
    },
    /**
     *
     * @param matchId
     * @param joined {1|0}
     */
    getTournamentUsers(tournamentId, joined = 1) {
        return axios.
            get(`${BASE_URL}/tournaments/${tournamentId}/users`, {params: Object.assign({}, {joined})});
    }
};

export default {
    namespaced: true,
    requests
}