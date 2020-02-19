<template>
    <div id="login-page">
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
        },
        created() {
        },
        methods: {
            // Log the user in
            login() {
                console.log(this.$auth.loginWithPopup());
                console.log(this.$auth);
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