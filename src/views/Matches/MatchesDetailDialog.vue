<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog" fullscreen persistent>
        <v-card>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-layout wrap layout--input>
                        <v-flex xs12 md6>
                            <v-text-field
                                v-model="matchName"
                                :readonly="!canUserEditMatch"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-autocomplete
                                v-model="matchGame"
                                :items="computedGameList"
                                :search-input.sync="matchGameName"
                                :readonly="!canUserEditMatch"
                                :label="$tc('game', 1)"
                                item-value="id"
                                item-text="name"
                                return-object
                                :clearable="canUserEditMatch"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field
                                v-model="matchMaxParticipants"
                                :label="$tc('participants', 1)"
                                :readonly="!canUserEditMatch"
                                type="number"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-select
                                v-model="matchIsPrivate"
                                :items="[{value: false, text: $t('no')}, {value: true, text: $t('yes')}]"
                                item-value="value"
                                item-text="text"
                                :label="$tc('private', 1)"
                                :readonly="!canUserEditMatch"
                            ></v-select>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout wrap>
                                <v-flex xs12 md6>
                                    <v-layout column>
                                        <v-flex>
                                            <v-layout layout--input>
                                                <v-flex><span>{{$t('available_users')}}</span></v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex>
                                            <v-layout layout--input>
                                                <v-data-table
                                                    :headers="userHeader"
                                                    :items="notJoinedUsers"
                                                    item-key="id"
                                                    :page="notJoinedUsersPage"
                                                    :items-per-page.sync="notJoinedUsersPerPage"
                                                    :footer-props.sync="notJoinedUsersPageFooterProps"
                                                    :server-items-length="notJoinedUsersCount"
                                                    :loading="isLoadingNotJoinedUsers"
                                                    disable-sort
                                                    class="v-data-table--users"
                                                >
                                                    <template #item="props">
                                                        <tr>
                                                            <td class="text-left">
                                                                <div>{{props.item.name}}</div>
                                                            </td>
                                                            <td class="text-center">
                                                                <v-btn small icon @click="joinMatch()">
                                                                    <v-icon>person_add</v-icon>
                                                                </v-btn>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </v-data-table>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-layout column>
                                        <v-flex>
                                            <v-layout layout--input>
                                                <v-flex><span>{{$t('available_users')}}</span></v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex>
                                            <v-layout layout--input>
                                                <v-data-table
                                                    :headers="userHeader"
                                                    :items="joinedUsers"
                                                    item-key="id"
                                                    :page="joinedUsersPage"
                                                    :items-per-page.sync="joinedUsersPerPage"
                                                    :footer-props.sync="joinedUsersPageFooterProps"
                                                    :server-items-length="joinedUsersCount"
                                                    :loading="isLoadingJoinedUsers"
                                                    disable-sort
                                                    class="v-data-table--users"
                                                >
                                                    <template #item="props">
                                                        <tr>
                                                            <td class="text-left">
                                                                <div>{{props.item.name}}</div>
                                                            </td>
                                                            <td class="text-center">
                                                                <v-btn small icon @click="disjoinMatch()">
                                                                    <v-icon>person_add_disabled</v-icon>
                                                                </v-btn>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </v-data-table>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-flex>
                        <v-btn v-if="canUserEditMatch" :disabled="!matchId || isMatchSaving" @click="saveMatch">
                            {{$t('save')}}
                        </v-btn>
                        <v-btn v-if="canJoinMatch()" :disabled="isMatchSaving" @click="joinMatch">{{$t('join')}}</v-btn>
                        <v-btn v-else-if="canDisjoinMatch()" :disabled="isMatchSaving" @click="disjoinMatch">
                            {{$t('disjoin')}}
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import vDialogComponentMixin from "@/mixins/VDialogComponentMixin";
    import MatchApi from '@/api/matches';
    import GameApi from '@/api/games';

    export default {
        name: "MatchesDetailDialog",
        mixins: [vDialogComponentMixin],
        props: {
            matchUuid: {
                type: String,
                default: 0
            },
        },
        data() {
            return {
                matchId: 0,
                matchName: '',
                matchGame: null,
                matchGameName: '',
                matchMaxParticipants: 0,
                matchCreatorId: 0,
                matchIsPrivate: null,
                matchTournament: null,
                matchParticipants: [],
                isMatchLoading: false,
                isMatchSaving: false,
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
            name() {
                return this.data;
            },
            loggedUser() {
                return this.$store.getters['auth/user'];
            },
            canUserEditMatch() {
                if (!this.loggedUser) return false;
                return this.loggedUser.id === this.matchCreatorId;
            },
            computedGameList() {
                let list = [...this.gameList];
                if (this.matchGameName) {
                    list.push({id: 0, name: this.matchGameName});
                }
                return list;
            }
        },
        watch: {
            matchUuid: {
                immediate: true,
                handler(uuid) {
                    if (uuid) {
                        this.loadMatch();
                    } else {
                        this.setMatchData(null);
                    }
                }
            },
            notJoinedUsersPerPage() {
                this.loadNotJoinedUsers(true)
            },
            notJoinedUsersPage() {
                this.loadNotJoinedUsers();
            },
            joinedUsersPerPage() {
                this.loadJoinedUsers(true);
            },
            joinedUsersPage() {
                this.loadJoinedUsers();
            },
            matchGameName(newName) {
                this.filterGames(newName);
            },
        },
        methods: {
            async saveMatch() {
                let data = {
                    name: this.matchName,
                    maxParticipants: this.matchMaxParticipants,
                    gameId: this.matchGame ? this.matchGame.id : null,
                    gameName: this.matchGame ? this.matchGame.name : null,
                    isPrivate: this.matchIsPrivate || false,
                };
                this.isMatchSaving = true;
                await MatchApi.requests.patchMatch(this.matchId, 'edit', data)
                    .then(response => {
                        this.setMatchData(response.data);
                    })
                    .catch(response => {
                        // TODO: Add snackbar error
                    });
                this.isMatchSaving = false;
            },
            async loadMatch() {
                this.isMatchLoading = true;
                await MatchApi.requests.getMatch(this.matchUuid)
                    .then(response => {
                        this.setMatchData(response.data);
                    })
                    .catch(response => {
                    });
                this.isMatchLoading = false;
            },
            setMatchData(match) {
                if (match) {
                    this.matchId = match.id;
                    this.matchName = match.name;
                    this.matchGame = match.game;
                    this.matchMaxParticipants = match.max_participants;
                    this.matchCreatorId = match.creator_id;
                    this.matchIsPrivate = match.is_private;
                    this.matchTournament = match.tournament;
                    this.matchParticipants = match.participants;
                    this.notJoinedUsers = [];
                    this.joinedUsers = [];
                    this.loadJoinedUsers();
                    this.loadNotJoinedUsers();
                } else {
                    this.matchId = 0;
                    this.matchName = '';
                    this.matchGame = null;
                    this.matchMaxParticipants = 0;
                    this.matchCreatorId = 0;
                    this.matchIsPrivate = null;
                    this.matchTournament = null;
                    this.matchParticipants = [];
                    this.notJoinedUsers = [];
                    this.joinedUsers = [];
                }
            },
            canJoinMatch() {
                if (!this.loggedUser) return false;
                if (this.matchTournament) return false;
                if (this.matchParticipants.findIndex(p => p.id === this.loggedUser.id) !== -1) return false;
                return true;
            },
            canDisjoinMatch() {
                if (!this.loggedUser) return false;
                if (this.matchTournament) return false;
                if (this.matchParticipants.findIndex(p => p.id === this.loggedUser.id) !== -1) return true;
                return false;
            },
            async joinMatch() {
                await MatchApi.requests.patchMatch(this.matchId, 'join')
                    .then(response => {
                        this.$store.dispatch('snackbar/SHOW_MESSAGE', {
                            text: this.$t('snackbar_success_join_to_match'),
                            color: 'success'
                        });
                        this.matchParticipants.push({id: this.loggedUser.id, name: this.loggedUser.name});
                        this.loadJoinedUsers(true);
                        this.loadNotJoinedUsers(true);
                    })
                    .catch(response => {
                        this.$store.dispatch('snackbar/SHOW_MESSAGE', {text: response.data.message, color: 'error'});
                    });
            },
            async disjoinMatch() {
                await MatchApi.requests.patchMatch(this.matchId, 'disjoin')
                    .then(response => {
                        this.$store.dispatch('snackbar/SHOW_MESSAGE', {
                            text: this.$t('snackbar_success_disjoin_to_match'),
                            color: 'success'
                        });
                        let index = this.matchParticipants.findIndex(p => p.id === this.loggedUser.id);
                        if (index !== -1) {
                            this.matchParticipants.splice(index, 1);
                            this.matchParticipants = [...this.matchParticipants];
                        }
                        this.loadJoinedUsers(true);
                        this.loadNotJoinedUsers(true);
                    })
                    .catch(response => {
                        this.$store.dispatch('snackbar/SHOW_MESSAGE', {text: response.data.message, color: 'error'});
                    });
            },
            async loadNotJoinedUsers(reset) {
                if (reset) {
                    this.notJoinedUsers = [];
                }
                this.isLoadingNotJoinedUsers = true;
                await MatchApi.requests.getMatchUsers(this.matchId, 0)
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
                await MatchApi.requests.getMatchUsers(this.matchId, 1)
                    .then(response => {
                        let data = response.data;
                        this.joinedUsersCount = data.total_users;
                        this.joinedUsers = data.users;
                    });
                this.isLoadingJoinedUsers = false;
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

<style lang="stylus" scoped>
    .v-data-table
        &--users
            height 400px
</style>