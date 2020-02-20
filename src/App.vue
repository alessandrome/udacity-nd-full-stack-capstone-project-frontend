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
        created() {window.$auth = this.$auth},
        watch: {
            '$auth.token': {
                handler(newValue) {
                    this.$store.dispatch('auth/GET_USER_INFO', newValue ? this.$auth.user : null);
                }
            },
        },
    }
</script>

<style lang="stylus">
</style>
