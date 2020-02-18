<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog" v-on="$listeners">
        <v-card>
            <v-card-title>
                {{ $t(gameId ? 'save_game' : 'create_game')}}
            </v-card-title>
            <v-card-text>
                <v-form ref="gameDialogForm">
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field
                                v-model="gameName"
                                :label="$tc('name', 1)"
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
                    <v-btn @click="saveGame">{{$t(gameId ? 'save' : 'create')}}</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import InputRulesMixin from "@/mixins/InputRulesMixin";
    import VDialog from "vuetify/lib/components/VDialog/index";
    import GameApi from "@/api/games";

    export default {
        name: "GamesSaveGameDialog",
        mixins: [InputRulesMixin],
        props: {
            game: {
                type: Object,
            },
            vDialogProps: {
                type: Object,
                default: () => ({}),
            },
            value: {}
        },
        data() {
            return {
                gameId: 0,
                gameName: '',
                rules: {
                    required: (val) => !!val || this.$t('error_input_field_required')
                },
            }
        },
        computed: {
            showDialog: {
                get() {
                    return this.value;
                },
                set(v) {
                    this.$emit('input', v);
                }
            }

        },
        methods: {
            saveGame() {
                if (this.$refs.gameDialogForm.validate()) {
                    if (this.gameId) {
                        this.editGame();
                    } else {
                        this.createGame();
                    }
                }
            },
            async createGame() {
                let data = {
                    name: this.gameName,
                };
                let result = await GameApi.requests.createGame(data);
                console.log({result});
                this.$emit('create:game', result.data);
                this.$emit('save:game', result.data);
            },
            async editGame() {
                 let data = {
                    name: this.gameName,
                };
                let result = await GameApi.requests.patcheGame(this.gameId, data);
                console.log({result});
                this.$emit('update:game', result.data);
                this.$emit('save:game', result.data);
            },
            setGameData(game) {
                if (game) {
                    this.gameId = game.id || 0;
                    this.gameName = game.name || '';
                } else {
                    this.gameId = 0;
                    this.gameName = '';
                }
            }
        },
    }
</script>

<style scoped>

</style>