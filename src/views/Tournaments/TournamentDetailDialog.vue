<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog" fullscreen persistent>
        <v-card>
            <v-card-title class="pa-0">
                <v-tabs
                    v-model="tab"
                >
                    <v-tab v-for="item in tabs" :key="item.value">
                        {{ item.text }}
                    </v-tab>

                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeDialog" class="align-self-center">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-tabs>
            </v-card-title>
            <v-card-text class="pa-0">
                <v-container fluid>
                    <v-tabs-items v-model="tab">
                        <v-tab-item :key="'detail'" class="px-4 pt-2">
                            <v-layout wrap layout--input>
                                <v-flex xs12 md6>
                                    <v-text-field
                                        v-model="tournamentName"
                                        :readonly="!canUserEditTournament"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-autocomplete
                                        v-model="tournamentGame"
                                        :items="computedTournamentList"
                                        :search-input.sync="tournamentGameName"
                                        :readonly="!canUserEditTournament"
                                        :label="$tc('game', 1)"
                                        item-value="id"
                                        item-text="name"
                                        return-object
                                        :clearable="canUserEditTournament"
                                    ></v-autocomplete>
                                </v-flex>
                            </v-layout>
                            <v-layout>
                                <v-spacer></v-spacer>
                                <v-flex flex-grow-0>
                                    <v-btn v-if="canUserEditTournament" :disabled="!tournamentId || isTournamentSaving"
                                           @click="saveTournament">
                                        {{$t('save')}}
                                    </v-btn>
                                    <v-btn v-if="canJoinTournament()" :disabled="isTournamentSaving" @click="joinTournament">
                                        {{$t('join')}}
                                    </v-btn>
                                    <v-btn v-else-if="canDisjoinTournament()" :disabled="isTournamentSaving"
                                           @click="disjoinTournament">
                                        {{$t('disjoin')}}
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-tab-item>

                        <v-tab-item :key="'matches'">
                            <tournament-detail-dialog-match-list :tournament="tournament"></tournament-detail-dialog-match-list>
                        </v-tab-item>
                    </v-tabs-items>
                </v-container>
            </v-card-text>
            <v-card-actions>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import vDialogComponentMixin from "@/mixins/VDialogComponentMixin";
    import TournamentApi from '@/api/tournaments';
    import GameApi from '@/api/games';
    import TournamentDetailDialogMatchList from "./TournamentDetailDialogMatchList";

    export default {
        name: "TournamentDetailDialog",
        mixins: [vDialogComponentMixin],
        components: {TournamentDetailDialogMatchList},
        props: {
            tournamentUuid: {},
        },
        data() {
            return {
                tabs: [
                    {text: this.$tc('detail', 1), value: 'detail'},
                    {text: this.$tc('match', 2), value: 'matches'},
                ],
                tab: 'detail',
                tournament: null,
                tournamentId: 0,
                tournamentName: '',
                tournamentGame: null,
                tournamentGameName: '',
                tournamentMaxParticipants: 0,
                tournamentCreatorId: 0,
                tournamentStartDate: null,
                tournamentParticipants: [],
                isTournamentLoading: false,
                isTournamentSaving: false,
                gameList: [],
                userHeader: [
                    {text: this.$tc('name', 1), value: 'name',},
                    {text: this.$tc('aciton', 2), sortable: false, align: 'center'},
                ],
                notJoinedUsers: [],
                notJoinedUsersCount: 0,
                notJoinedUsersPerPage: 20,
                notJoinedUsersPage: 1,
                notJoinedUsersPageFooterProps: {
                    itemsPerPageOptions: [20, 30, 50],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                },
                isLoadingNotJoinedUsers: false,
                joinedUsers: [],
                joinedUsersCount: 0,
                joinedUsersPerPage: 20,
                joinedUsersPage: 1,
                joinedUsersPageFooterProps: {
                    itemsPerPageOptions: [20, 30, 50],
                    showCurrentPage: true,
                    showFirstLastPage: true,
                },
                isLoadingJoinedUsers: false,
                gameFilterCount: 0,
            }
        },
        computed: {
            loggedUser() {
                return this.$store.getters['auth/user'];
            },
            canUserEditTournament() {
                if (!this.loggedUser) return false;
                return this.loggedUser.id === this.tournamentCreatorId;
            },
            computedTournamentList() {
                let list = [...this.gameList];
                if (this.tournamentGameName) {
                    list.push({id: 0, name: this.tournamentGameName});
                }
                return list;
            },
        },
        watch: {
            tournamentUuid: {
                immediate: true,
                handler(uuid) {
                    if (uuid) {
                        this.loadTournament();
                    } else {
                        this.setTournamentData(null);
                    }
                }
            },
            tournamentGameName(newName) {
                this.filterGames(newName);
            },
        },
        methods: {
            async loadTournament() {
                this.isTournamentLoading = true;
                await TournamentApi.requests.getTournament(this.tournamentUuid)
                    .then(response => {
                        this.setTournamentData(response.data);
                    })
                    .catch(response => {

                    });
                this.isTournamentLoading = false;
            },
            async setTournamentData(tournament) {
                if (tournament) {
                    this.tournamentId = tournament.id;
                    this.tournamentName = tournament.name;
                    this.tournamentGame = tournament.game;
                    this.tournamentMaxParticipants = tournament.max_participants;
                    this.tournamentStartDate = tournament.start_date;
                    this.tournamentCreatorId = tournament.creator_id;
                    this.notJoinedUsers = [];
                    this.joinedUsers = [];
                    this.loadJoinedUsers();
                    this.loadNotJoinedUsers();
                    this.tournament = tournament;
                } else {
                    this.tournamentId = 0;
                    this.tournamentName = '';
                    this.tournamentGame = null;
                    this.tournamentMaxParticipants = 0;
                    this.tournamentStartDate = null;
                    this.tournamentCreatorId = 0;
                    this.notJoinedUsers = [];
                    this.joinedUsers = [];
                    this.tournament = null;
                }
            },
            async loadNotJoinedUsers(reset) {
                if (reset) {
                    this.notJoinedUsers = [];
                }
                this.isLoadingNotJoinedUsers = true;
                await TournamentApi.requests.getTournamentUsers(this.tournamentId, 0)
                    .then(response => {
                        let data = response.data;
                        this.notJoinedUsersCount = data.total_users;
                        this.notJoinedUsers = data.users;
                    });
                this.isLoadingNotJoinedUsers = false;
            },
            async loadJoinedUsers(reset) {
                if (reset) {
                    this.joinedUsers = [];
                }
                this.isLoadingJoinedUsers = true;
                await TournamentApi.requests.getTournamentUsers(this.tournamentId, 1)
                    .then(response => {
                        let data = response.data;
                        this.joinedUsersCount = data.total_users;
                        this.joinedUsers = data.users;
                    });
                this.isLoadingJoinedUsers = false;
            },
            canJoinTournament() {
                if (!this.loggedUser) return false;
                if (this.tournamentParticipants.findIndex(p => p.id === this.loggedUser.id) !== -1) return false;
                return true;
            },
            canDisjoinTournament() {
                if (!this.loggedUser) return false;
                if (this.tournamentParticipants.findIndex(p => p.id === this.loggedUser.id) !== -1) return true;
                return false;
            },
            async joinTournament() {

            },
            async disjoinTournament() {

            },
            async saveTournament() {
                let data = {
                    name: this.tournamentName,
                    maxParticipants: this.tournamentMaxParticipants,
                    gameId: this.tournamentGame ? this.tournamentGame.id : null,
                    gameName: this.tournamentGame ? this.tournamentGame.name : null,
                    startDate: this.tournamentStartDate,
                };
                this.isTournamentSaving = true;
                await TournamentApi.requests.patchTournament(this.tournamentId, 'edit', data)
                    .then(response => {
                        this.setTournamentData(response.data);
                    })
                    .catch(response => {
                        // TODO: Add snackbar error
                    });
                this.isTournamentSaving = false;
            },
            filterGames(searchTerm) {
                let filterCount = ++this.gameFilterCount;
                setTimeout(async () => {
                    if (filterCount === this.gameFilterCount) {
                        let result = await GameApi.requests.getGames({}, {name: searchTerm});
                        if (filterCount === this.gameFilterCount) {
                            this.gameList = result.data.games;
                        }
                    }
                }, 300);
            },
        },
    }
</script>

<style scoped>

</style>