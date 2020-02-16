<template>
    <v-container fluid>
        <v-layout column>
            <v-flex filter-row>
                <v-layout>
                    <v-text-field
                        v-model="gameSearchTerm"
                        single-line
                        hide-details
                        class="filter-row--search-term"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn v-if="can('create:game')">{{ $t('create') }}</v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-data-table
                    :headers="gameHeader"
                    :items="gameList"
                    item-key="id"
                    :page="gamePage"
                    :items-per-page.sync="gamePerPage"
                    :footer-props.sync="gamePageFooterProps"
                    :server-items-length="gameCount"
                    :loading="gameListLoading"
                    class="v-data-table--full-page"
                ></v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import AuthMixin from '@/mixins/AuthMixin';
    import GamesApi from '@/api/games';

    export default {
        name: "Games",
        mixins: [AuthMixin],
        data() {
            return {
                gameList: [],
                gameCount: 0,
                gamePerPage: 20,
                gamePage: 1,
                gamePageFooterProps: {
                    itemsPerPageOptions: [20, 30, 50],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                },
                gameHeader: [
                    {text: this.$tc('name', 1), value: 'name'},
                    // {text: 'name', value: 'name'},
                ],
                gameListLoading: false,
                gameListLoadingCount: 0,
                gameSearchTerm: '',
                filterCount: 0,
            }
        },
        computed: {
        },
        watch: {
            gamePerPage(newValue, oldValue) {
                this.loadGames(true)
            },
            gamePage(newPage, oldPage) {
                this.loadGames(true);
            },
            gameSearchTerm(newTerm, oldTerm) {
                this.filterGames();
            },
        },
        created() {
            window.a = this;
            this.loadGames();
        },
        methods: {
            async loadGames(reset) {
                if (reset) {
                    this.gameList = [];
                }
                this.gameListLoading = true;
                let loadCount = ++this.gameListLoadingCount;
                let filter = {};
                if (this.gameSearchTerm) filter.searchTerm = this.gameSearchTerm;
                let r = await GamesApi.requests.getGames({}, filter, this.gamePage, this.gamePerPage);
                if (loadCount === this.gameListLoadingCount) {
                    this.gameList = r.data.games;
                    this.gameCount = r.data.total_games;
                    this.gameListLoading = false;
                }
            },
            filterGames() {
                let filterCount = ++this.filterCount;
                setTimeout(() => {
                    if (filterCount === this.filterCount)
                        this.loadGames(true);
                }, 300);
            }
        },
    }
</script>

<style scoped>

</style>