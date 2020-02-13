<template>
    <nav class="layout">
        <div><router-link to="/"><img src="@/assets/logo.png" class="logo"/></router-link></div>
        <v-layout page-links>
            <router-link to="/"><div class="page-link">Test</div></router-link>
            <router-link to="/"><div class="page-link">Test</div></router-link>
        </v-layout>
        <div>
            <router-link to="/login">Login</router-link>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "Navbar"
    }
</script>

<style lang="stylus" scoped>
    nav
        background #eeeeee
        border-bottom 1px solid #dddddd
        > *
            flex 0 0 auto
            height 100%
        > .page-links
            flex 1 0 auto
            align-items center
            height 100%
            > *
                height 100%
                &:first-child
                    margin-left auto
                &:last-child
                    margin-right auto

    img
        max-height 100%
</style>