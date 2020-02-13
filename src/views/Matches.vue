<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-data-table
                    :items="matchList"
                    item-key="id"
                    class="v-data-table--full-page"
                ></v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import MatchApi from '@/api/matches';

    export default {
        name: "Matches",
        data() {
            return {
                matchList: [],
                matchPerPage: 20,
                matchPage: 1,
            }
        },
        created() {
            window.a = this;
            this.loadMatches();
        },
        methods: {
            async loadMatches() {
                let r = await MatchApi.requests.getMatches({}, {}, this.matchPage, this.matchPerPage)
                console.log({r})
            }
        },
    }
</script>

<style scoped>

</style>