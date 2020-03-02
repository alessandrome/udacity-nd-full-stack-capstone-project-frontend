<template>
    <v-container fluid>
        <tournament-save-tournament-dialog v-model="isSaveTournamentDialogOpen" @save:match="tournamentSaved"></tournament-save-tournament-dialog>
<!--        <matches-detail-dialog v-model="isMatchDetailOpen" :match-uuid="matchDetailUuid"></matches-detail-dialog>-->
        <v-layout column>
             <v-flex filter-row>
                <v-layout>
                    <v-text-field
                        v-model="tournamentSearchTerm"
                        single-line
                        hide-details
                        class="filter-row--search-term"
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn v-if="can('create:tournament')" @click="openSaveTournamentDialog">{{ $t('create') }}</v-btn>
                </v-layout>
            </v-flex>
            <v-flex>
                <v-data-table
                    :headers="tournamentTableHeader"
                    :items="tournamentList"
                    item-key="id"
                    :page.sync="tournamentPage"
                    :footer-props.sync="tournamentPageFooterProps"
                    :server-items-length="tournamentCount"
                    :loading="tournamentListLoading"
                    disable-sort
                    class="v-data-table--full-page"
                >
                    <template #item="props">
                        <tr>
                            <td class="text-center"><div><v-btn icon @click="openTournamentDetail(props.item)"><v-icon>open_in_browser</v-icon></v-btn></div></td>
                            <td class="text-left"><div>{{props.item.name}}</div></td>
                            <td class="text-center"><div>{{props.item.participants.length}}/{{props.item.max_participants}}</div></td>
                            <td class="text-center"><div>{{props.item.tournament && props.item.tournament.name}}</div></td>
                            <td class="text-center">
                                <v-btn v-if="canDeleteTournament(props.item)" small icon><v-icon>close</v-icon></v-btn>
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
    import TournamentSaveTournamentDialog from "@/views/Tournaments/TournamentSaveTournamentDialog";
    // import MatchesDetailDialog from "./Matches/MatchesDetailDialog";
    import TournamentApi from '@/api/tournaments';

    export default {
        name: "Tournaments",
        mixins: [AuthMixin],
        components: {TournamentSaveTournamentDialog},
        data() {
            return {
                tournamentList: [],
                tournamentCount: 0,
                tournamentPerPage: 20,
                tournamentPage: 1,
                tournamentPageFooterProps: {
                    itemsPerPageOptions: [20, 30, 50],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                },
                tournamentTableHeader: [
                    {text: '', sortable: false},
                    {text: this.$tc('name', 1), value: 'name'},
                    {text: this.$tc('participant', 1), value: 'participant_number', align: 'center'},
                    {text: this.$tc('tournament', 1), value: 'tournament.name', align: 'center'},
                    {text: this.$tc('action', 2),  align: 'center'},
                ],
                tournamentListLoading: false,
                tournamentListLoadingCount: 0,
                tournamentSearchTerm: '',
                isSaveTournamentDialogOpen: false,
                tournamentDetailUuid: '',
            }
        },
        computed: {
            loggedUser() {
                return this.$store.getters['auth/user'];
            },
            isTournamentDetailOpen: {
                get() {
                    return !!this.tournamentDetailUuid;
                },
                set(value) {
                    if (!value) {
                        this.tournamentDetailUuid = '';
                    }
                }
            }
        },
        watch: {
            '$route.params.uuid': {
                immediate: true,
                handler(uuid) {
                    if (uuid) {
                        this.tournamentDetailUuid = '' + uuid;
                    } else {
                        this.tournamentDetailUuid = '';
                    }
                }
            },
            tournamentPerPage(newValue, oldValue) {
                this.loadTournaments();
            },
            tournamentDetailUuid: {
                immediate: true,
                handler(uuid) {
                    if (uuid) {
                        this.$router.push({name: 'tournaments', params: {uuid}});
                    } else {
                         this.$router.push({name: 'tournaments', params: {}});
                    }
                }
            }
        },
        created() {
            window.a = this;
            console.log(this.auth0Permissions);
            this.loadTournaments();
        },
        methods: {
            async loadTournaments(reset) {
                if (reset) {
                    this.tournamentList = [];
                }
                this.tournamentListLoading = true;
                let loadCount = ++this.tournamentListLoadingCount;
                await TournamentApi.requests.getTournaments({}, {}, this.tournamentPage, this.tournamentPerPage)
                    .then(response => {
                        if (loadCount === this.tournamentListLoadingCount) {
                            this.tournamentList = response.data.tournaments;
                            this.tournamentCount = response.data.total_tournaments;
                            this.tournamentListLoading = false;
                        }
                    })
                    .catch(response => {
                        // TODO: add error snackbar
                    });
                if (loadCount === this.tournamentListLoadingCount) {
                    this.tournamentListLoading = false;
                }
            },
            openSaveTournamentDialog() {
                this.isSaveTournamentDialogOpen = true;
            },
            closeSaveTournamentDialog() {
                this.isSaveTournamentDialogOpen = false;
            },
            tournamentSaved(tournament) {
                this.closeSaveTournamentDialog();
                this.loadTournaments(true)
            },
            canDeleteTournament(tournament) {
                return ((this.loggedUser && this.loggedUser.id === tournament.creator_id) || (this.can('delete:any-tournament')));
            },
            openTournamentDetail(match) {
                this.tournamentDetailUuid = match.uuid;
            }
        },
    }
</script>

<style scoped>

</style>