<template>
    <v-container fluid>
        <v-layout>
            <v-flex>
                <v-data-table
                    :items="matchList"
                    item-key="id"
                    :page="matchPage"
                    :footer-props.sync="matchPageFooterProps"
                    :server-items-length="matchCount"
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
                matchCount: 0,
                matchPerPage: 20,
                matchPage: 1,
                matchPageFooterProps: {
                    itemsPerPageOptions: [20, 30, 50],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                },
                matchListLoading: false,
                matchListLoadingCount: 0,
            }
        },
        watch: {
            matchPerPage(newValue, oldValue) {

            }
        },
        created() {
            window.a = this;
            this.loadMatches();
        },
        methods: {
            async loadMatches(reset) {
                if (reset) {
                    this.matchList = [];
                }
                this.matchListLoading = true;
                let loadCount = ++this.matchListLoadingCount;
                let r = await MatchApi.requests.getMatches({}, {}, this.matchPage, this.matchPerPage);
                if (loadCount === this.matchListLoading) {
                    this.matchList = r.data.matches;
                    this.matchCount = r.data.total_matches;
                }
            }
        },
    }
</script>

<style scoped>

</style>