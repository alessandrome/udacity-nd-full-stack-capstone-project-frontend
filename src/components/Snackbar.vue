<template>
    <v-snackbar
        top
        v-model="snackbar.visible"
        :timeout="snackbar.timeout"
        :multi-line="snackbar.multiline === true">

        {{ snackbar.text }}

        <v-btn flat dark @click="closeSnackbar">Close</v-btn>

    </v-snackbar>
</template>

<script>
    import {mapMutations} from "vuex"

    export default {
        name: 'Snackbar',
        computed: {
            snackbar() {
                return this.$store.state.snackbar.snackbar;
            }
        },
        methods: {
            ...mapMutations(["closeSnackbar"])
        },
    }
</script>

<style scoped>

</style>