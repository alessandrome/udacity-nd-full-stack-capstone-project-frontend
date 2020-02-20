<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog">
        <v-card>
            <v-card-title>
                {{ $t(matchId ? 'save_match' : 'create_match')}}
            </v-card-title>
            <v-card-text>
                <v-form ref="matchDialogForm" @submit.prevent>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-layout>
                                <v-flex flex-grow-1 pr-1>
                                    <v-text-field
                                        v-model="matchName"
                                        :label="$tc('name', 1)"
                                        :rules="[inputRules.required]"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex flex-grow-0 pl-1>
                                    <v-switch
                                        v-model="matchPrivate"
                                        :label="$tc('private', 1)"
                                        :rules="[inputRules.required]"
                                    ></v-switch>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-autocomplete
                                v-model="matchGame"
                                :items="computedGameList"
                                :search-input.sync="matchGameName"
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
                                v-model="matchParticipants"
                                :label="$t('number_of_participants', 1)"
                                :rules="[inputRules.required]"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn @click="showDialog = false">{{$t('cancel')}}</v-btn>
                    <v-btn @click="saveMatch">{{$t(matchId ? 'save' : 'create')}}</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import VDialogComponentMixin from '@/mixins/VDialogComponentMixin';
    import InputRulesMixin from '@/mixins/InputRulesMixin';
    import MatchApi from '@/api/matches';
    import GameApi from '@/api/games';

    export default {
        name: "MatchSaveMatchDialog",
        mixins: [VDialogComponentMixin, InputRulesMixin],
        props: {
            match: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                matchId: 0,
                matchName: '',
                matchGame: null,
                matchGameName: '',
                matchPrivate: false,
                matchParticipants: 2,
                gameFilterCount: 0,
                gameList: [],
            }
        },
        computed: {
            computedGameList() {
                let list = [...this.gameList];
                if (this.matchGameName) {
                    list.push({id: 0, name: this.matchGameName});
                }
                return list;
            }
        },
        watch: {
            matchGameName(newName) {
                this.filterGames(newName);
            }
        },
        methods: {
            saveMatch() {
                if (this.matchId) {
                    this.editGame();
                } else {
                    this.createGame();
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
            async createGame() {
                let data = {
                    name: this.matchName,
                    maxParticipants: this.matchParticipants,
                    gameId: this.matchGame.id,
                    gameName: this.matchGame.name,
                    isPrivate: this.matchPrivate,
                };
                let response = await MatchApi.requests.createMatch(data);
                let game = response.data;
                this.$emit('create:match', game);
                this.$emit('save:match', game);
            },
            async editGame() {
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