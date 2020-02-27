<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog" fullscreen persistent>
        <v-card>
            <v-card-title><v-spacer></v-spacer><v-btn icon @click="closeDialog"><v-icon>close</v-icon></v-btn></v-card-title>
            <v-card-text>
                <v-container>
                    <v-layout wrap>
                        <v-flex xs12 md6>
                            <v-text-field
                                v-model="matchName"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-autocomplete
                                v-model="matchGame"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-autocomplete
                                v-model="matchMaxParticipants"
                            ></v-autocomplete>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-layout>
                    <v-spacer></v-spacer>
                    <v-flex>
                        <v-btn :disabled="!matchId || isMatchSaving" @click="saveMatch">{{$t('save')}}</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import vDialogComponentMixin from "@/mixins/VDialogComponentMixin";
    import MatchApi from '@/api/matches';

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
                matchMaxParticipants: 0,
                isMatchLoading: false,
                isMatchSaving: false,
            }
        },
        computed: {
            name() {
                return this.data;
            }
        },
        methods: {
            async saveMatch() {
                let data = {
                    name: this.matchName,
                    maxParticipants: this.matchMaxParticipants,
                    gameId: this.matchGame ? this.matchGame.id : null,
                    gameName: this.matchGame ? this.matchGame.name : null,
                };
                this.isMatchSaving = true;
                await MatchApi.requests.patchMatch(this.matchId, 'edit', data)
                    .then(response => {
                        this.setMatchData(response.data);
                    });
                this.isMatchSaving = false;
            },
            setMatchData(match) {
                if (match) {
                    this.matchId = match.id;
                    this.matchName = match.name;
                    this.matchGame = match.game;
                    this.matchMaxParticipants = match.max_participants;
                } else {
                    this.matchId = 0;
                    this.matchName = '';
                    this.matchGame = null;
                    this.matchMaxParticipants = 0;
                }
            },
        },
    }
</script>

<style scoped>

</style>