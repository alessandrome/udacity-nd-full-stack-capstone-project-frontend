<template>
    <v-container fluid>
        <match-save-match-dialog v-model="isSaveMatchDialogOpen" @save:match="matchSaved"></match-save-match-dialog>
        <v-layout column>
             <v-flex filter-row>
                <v-layout>
                    <v-text-field
                        v-model="matchSearchTerm"
                        single-line
                        hide-details
                        class="filter-row--search-term"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn v-if="can('create:match')" @click="openSaveMatchDialog">{{ $t('create') }}</v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-data-table
                    :headers="matchTableHeader"
                    :items="matchList"
                    item-key="id"
                    :page="matchPage"
                    :footer-props.sync="matchPageFooterProps"
                    :server-items-length="matchCount"
                    :loading="matchListLoading"
                    disable-sort
                    class="v-data-table--full-page"
                >
                    <template #item="props">
                        <tr>
                            <td class="text-left"><div>{{props.item.name}}</div></td>
                            <td class="text-center"><div>{{props.item.participants.length}}/{{props.item.max_participants}}</div></td>
                            <td class="text-center"><div>{{props.item.tournament && props.item.tournament.name}}</div></td>
                            <td lass="text-center">
                                <v-btn v-if="canJoinMatch(props.item)" small icon>person_add</v-btn>
                                <v-btn v-if="canDeleteMatch(props.item)" small icon>close</v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import AuthMixin from '@/mixins/AuthMixin';
    import MatchSaveMatchDialog from "@/views/Matches/MatchSaveMatchDialog";
    import MatchApi from '@/api/matches';

    export default {
        name: "Matches",
        mixins: [AuthMixin],
        components: {MatchSaveMatchDialog},
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
                matchTableHeader: [
                    {text: this.$tc('name', 1), value: 'name'},
                    {text: this.$tc('participant', 1), value: 'participant_number', align: 'center'},
                    {text: this.$tc('tournament', 1), value: 'tournament.name', align: 'center'},
                    {text: this.$tc('action', 2),  align: 'center'},
                ],
                matchListLoading: false,
                matchListLoadingCount: 0,
                matchSearchTerm: '',
                isSaveMatchDialogOpen: false,
            }
        },
        computed: {
            loggedUser() {
                return this.$store.getters['auth/user'];
            }
        },
        watch: {
            matchPerPage(newValue, oldValue) {

            }
        },
        created() {
            window.a = this;
            console.log(this.auth0Permissions);
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
                if (loadCount === this.matchListLoadingCount) {
                    this.matchList = r.data.matches;
                    this.matchCount = r.data.total_matches;
                    this.matchListLoading = false;
                }
            },
            openSaveMatchDialog() {
                this.isSaveMatchDialogOpen = true;
            },
            closeSaveMatchDialog() {
                this.isSaveMatchDialogOpen = false;
            },
            matchSaved(match) {
                this.closeSaveMatchDialog();
                this.loadMatches(true)
            },
            canJoinMatch(match) {
                if (!this.loggedUser) return false;
                if (match.tournament) return false;
                if (match.participants.findIndex(p => p.id === this.loggedUser.id) !== -1) return false;
                return true;
            },
            canDeleteMatch(match) {
                return ((this.loggedUser && this.loggedUser.id === match.creator_id) || (this.can('delete:any-match')));
            },
        },
    }
</script>

<style scoped>

</style>