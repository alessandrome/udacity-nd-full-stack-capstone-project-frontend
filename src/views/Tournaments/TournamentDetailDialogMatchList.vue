<template>
    <v-container fluid>
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
                    <v-btn v-if="canCreateMatch" @click="openSaveMatchDialog">{{ $t('create') }}</v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-data-table
                    :headers="matchTableHeader"
                    :items="matchList"
                    item-key="id"
                    :page="matchPage"
                    :items-per-page.sync="matchPerPage"
                    :footer-props.sync="matchPageFooterProps"
                    :server-items-length="matchCount"
                    :loading="matchListLoading"
                    disable-sort
                    class="v-data-table--full-page"
                >
                    <template #item="props">
                        <tr>
                            <td class="text-center"><div><v-btn icon @click="openMatchDetail(props.item)"><v-icon>open_in_browser</v-icon></v-btn></div></td>
                            <td class="text-left"><div>{{props.item.name}}</div></td>
                            <td class="text-center"><div>{{props.item.participants.length}}/{{props.item.max_participants}}</div></td>
                            <td class="text-center"><div>{{props.item.tournament && props.item.tournament.name}}</div></td>
                            <td class="text-center">
                                <v-btn v-if="canDeleteMatch(props.item)" small icon><v-icon>close</v-icon></v-btn>
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
    import TournamentApi from '@/api/tournaments';

    export default {
        name: "TournamentDetailDialogMatchList",
        mixins: [AuthMixin],
        props: {
            tournament: {
                type: Object,
            },
        },
        data() {
            return {
                tournamentId: 0,
                tournamentUuid: '',
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
                    {text: '', sortable: false},
                    {text: this.$tc('name', 1), value: 'name'},
                    {text: this.$tc('participant', 2), value: 'participant_number', align: 'center'},
                    {text: this.$tc('tournament', 1), value: 'tournament.name', align: 'center'},
                    {text: this.$tc('action', 2),  align: 'center'},
                ],
                matchListLoading: false,
                matchListLoadingCount: 0,
                matchSearchTerm: '',
                isSaveMatchDialogOpen: false,
                matchDetailUuid: '',
            }
        },
        watch: {
            tournamentId(tournamentId, oldValue) {
                this.matchList = [];
                if (tournamentId) {
                    this.loadTournamentMatches(true);
                }
            },
            matchPerPage(perPage) {
                this.loadTournamentMatches(true);
            }
        },
        methods: {
            async loadTournamentMatches(reset) {
                if (reset) this.matchList = [];
                if (this.tournamentId) {
                    let loadCount = ++this.matchListLoadingCount;
                    this.matchListLoading = true;
                    await TournamentApi.requests.getTournamentMatches(this.tournamentId)
                        .then(response => {
                            if (loadCount === this.matchListLoadingCount) {
                                this.matchList = response.data.matches;
                                this.matchCount = response.data.total_matches;
                            }
                        })
                        .catch(response => {

                        });
                    if (loadCount === this.matchListLoadingCount) {
                        this.matchListLoading = false;
                    }
                }
            },
            setTournamentData(tournament) {
                if (tournament) {
                    this.tournamentId = tournament.id;
                    this.tournamentUuid = tournament.uuid;
                } else {
                    this.tournamentId = 0;
                    this.tournamentUuid = '';
                }
            },
            openSaveMatchDialog() {
                this.isSaveMatchDialogOpen = true;
            },
            closeSaveMatchDialog() {
                this.isSaveMatchDialogOpen = false;
            },
            canCreateMatch() {
                return ((this.loggedUser && this.loggedUser.id === match.creator_id && this.can('update:tournament')));
            },
            canDeleteMatch() {
                return ((this.loggedUser && this.loggedUser.id === match.creator_id) || (this.can('delete:any-match')));
            },
        },
    }
</script>

<style scoped>

</style>