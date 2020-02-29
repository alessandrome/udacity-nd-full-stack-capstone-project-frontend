const module = {
    namespaced: true,
    state: {
        snackbar: {
            visible: false,
            text: null,
            timeout: 6000,
            multiline: false,
            color: 'success',
        }
    },
    actions: {
        SHOW_MESSAGE(state, payload) {
            state.commit('showSnackbar', payload || {text: ''});
        }
    },
    mutations: {
        showSnackbar(state, payload) {
            state.snackbar.text = payload.text;
            state.snackbar.multiline = (payload.text.length > 50) ? true : false;

            if (payload.multiline) {
                state.snackbar.multiline = payload.multiline;
            }

            if (payload.timeout) {
                state.snackbar.timeout = payload.timeout;
            }

            if (payload.color) {
                state.snackbar.color =  payload.color;
            } else {
                state.snackbar.color = 'success';
            }

            state.snackbar.visible = true;
        },
        closeSnackbar(state) {
            state.snackbar.visible = false;
            state.snackbar.multiline = false;
            state.snackbar.timeout = 6000;
            state.snackbar.text = null;
        },
    }
};

export default module;