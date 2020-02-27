<template>
    <v-app id="app">
        <navbar id="nav"></navbar>
        <router-view v-if="!$auth.loading" id="content"/>
    </v-app>
</template>

<script>
    import Navbar from "@/components/Navbar";

    export default {
        name: 'App',
        components: {Navbar},
        created() {
            window.$auth = this.$auth;
            this.$root.$showSnackbar = this.showSnackbar;
        },
        watch: {
            '$auth.isAuthenticated': {
                handler() {
                    this.$auth.getTokenSilently();
                }
            },
            '$auth.token': {
                handler(newValue) {
                    this.$store.dispatch('auth/GET_USER_INFO', newValue ? this.$auth.user : null);
                }
            },
        },
        methods: {
            setLoggedUser(token) {
                this.$store.dispatch('auth/GET_USER_INFO', token ? this.$auth.user : null);
            },
            showSnackbar(text, props) {
                this.$store.dispatch('snackbar/SHOW', Object.assign({}, props, {text}));
            }
        },
    }
</script>

<style lang="stylus">
</style>
