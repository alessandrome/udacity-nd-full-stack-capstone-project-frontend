<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png"/>

        <!-- Check that the SDK client is not currently loading before accessing is methods -->
        <div v-if="!$auth.loading">
            <!-- show login when not authenticated -->
            <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
            <!-- show logout when authenticated -->
            <button v-if="$auth.isAuthenticated" @click="logout">Log out</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        watch: {
            '$auth.loading': {handler(newValue, oldValue) {

            }}
        },
        created() {
        },
        methods: {
            // Log the user in
            login() {
                console.log(this.$auth.loginWithRedirect());
            },
            // Log the user out
            logout() {
                this.$auth.logout({
                    returnTo: window.location.origin
                });
            }
        },
    }
</script>

<style scoped>

</style>