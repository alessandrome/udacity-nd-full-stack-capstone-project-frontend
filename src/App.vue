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
        components: {Navbar}
    }
</script>

<style lang="stylus">
</style>
