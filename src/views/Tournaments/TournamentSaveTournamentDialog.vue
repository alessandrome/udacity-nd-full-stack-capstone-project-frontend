<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog">
        <v-card>
            <v-card-title>
                {{ $t(tournamentId ? 'save_tournament' : 'create_tournament')}}
            </v-card-title>
            <v-card-text>
                <v-form ref="tournamentDialogForm" @submit.prevent>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-layout>
                                <v-flex flex-grow-1 pr-1>
                                    <v-text-field
                                        v-model="tournamentName"
                                        :label="$tc('name', 1)"
                                        :rules="[inputRules.required]"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-autocomplete
                                v-model="tournamentGame"
                                :items="computedGameList"
                                :search-input.sync="tournamentGameName"
                                :label="$tc('game', 1)"
                                item-value="id"
                                item-text="name"
                                return-object
                                clearable
                                :rules="[inputRules.required]"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                v-model="tournamentParticipants"
                                :label="$t('number_of_participants', 1)"
                                :rules="[inputRules.required]"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-menu
                                ref="tournamentDateMenu"
                                v-model="tournamentDateMenu"
                                :close-on-content-click="false"
                                :return-value.sync="tournamentDate"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="tournamentDate"
                                        :label="$t('start_date')"
                                        prepend-icon="event"
                                        readonly
                                        :rules="[inputRules.required]"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker v-model="tournamentDate" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="tournamentDateMenu = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.tournamentDateMenu.save(tournamentDate)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-menu
                                ref="tournamentTimeMenu"
                                v-model="tournamentTimeMenu"
                                :close-on-content-click="false"
                                :return-value.sync="tournamentTime"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-text-field
                                        v-model="tournamentTime"
                                        :label="$t('start_time')"
                                        prepend-icon="event"
                                        readonly
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-time-picker v-model="tournamentTime" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="tournamentTimeMenu = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.tournamentTimeMenu.save(tournamentTime)">OK</v-btn>
                                </v-time-picker>
                            </v-menu>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn @click="showDialog = false">{{$t('cancel')}}</v-btn>
                    <v-btn :disabled="isSavingTournament" @click="saveTournament">
                        <span>{{$t(tournamentId ? 'save' : 'create')}}</span>
                        <v-progress-circular v-if="isSavingTournament" size="16" width="2" indeterminate></v-progress-circular></v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import VDialogComponentMixin from '@/mixins/VDialogComponentMixin';
    import InputRulesMixin from '@/mixins/InputRulesMixin';
    import TournamentApi from '@/api/tournaments';
    import GameApi from '@/api/games';
    import formatISO from 'date-fns/formatISO';

    export default {
        name: "TournamentSaveTournamentDialog",
        mixins: [VDialogComponentMixin, InputRulesMixin],
        props: {
            tournament: {
                default: 0
            },
        },
        data() {
            return {
                tournamentId: 0,
                tournamentName: '',
                tournamentGame: null,
                tournamentGameName: '',
                tournamentPrivate: false,
                tournamentParticipants: 2,
                tournamentDate: null,
                tournamentDateMenu: false,
                tournamentTime: null,
                tournamentTimeMenu: false,
                gameFilterCount: 0,
                gameList: [],
                isSavingTournament: false,
            }
        },
        computed: {
            computedGameList() {
                let list = [...this.gameList];
                if (this.matchGameName) {
                    list.push({id: 0, name: this.tournamentGameName});
                }
                return list;
            },
            tournamentDateTime() {
                console.log({day: this.tournamentDate, time: this.tournamentTime});
                if (!this.tournamentDate || !this.tournamentTime) return null;
                return new Date(this.tournamentDate + ' ' + this.tournamentTime);
            }
        },
        watch: {
            tournamentGameName(newName) {
                this.filterGames(newName);
            },
        },
        methods: {
            saveTournament() {
                if (this.$refs.tournamentDialogForm.validate()) {
                    if (this.tournamentId) {
                        this.editTournament();
                    } else {
                        this.createTournament();
                    }
                }
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
            async createTournament() {
                let data = {
                    name: this.tournamentName,
                    maxParticipants: this.tournamentParticipants,
                    gameId: this.tournamentGame.id,
                    gameName: this.tournamentGame.name,
                    startDate: formatISO(this.tournamentDateTime),
                };
                this.isSavingTournament = true;
                let response = await TournamentApi.requests.createTournament(data)
                    .then(response => {
                        let tournament = response.data;
                        this.$emit('create:tournament', tournament);
                        this.$emit('save:tournament', tournament);
                    })
                    .catch(response => {
                        // TODO: Add snackbar error
                    });
                this.isSavingTournament = false;
            },
            async editTournament() {
            },
            selectNewGame() {
                this.matchGame = {id: 0, name: this.matchGameName};
            },
        },
    }
</script>

<style lang="stylus" scoped>
    .list-item
        &__title
            &--secondary
                color #cdcdcd
</style>