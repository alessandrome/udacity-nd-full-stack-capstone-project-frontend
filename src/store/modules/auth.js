import axios from '@/plugins/axios';
import UsersApi from "../../api/users";

const module = {
    namespaced: true,
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
    },
    actions: {
        async GET_USER_INFO(context, auth0user) {
            console.log({auth0user})
            if (auth0user) {
                let response = await UsersApi.requests.getUserInfo(auth0user);
                context.commit('setUser', Object.assign(response.data, auth0user));
            } else {
                context.dispatch('LOGOUT_USER');
            }
        },
        LOGOUT_USER(context) {
            context.commit('setUser', null);
        },
    },
    getters: {
        user: (state) => state.user,
        userId: (state) => state.user && state.user.id,
    },
};

export default module;