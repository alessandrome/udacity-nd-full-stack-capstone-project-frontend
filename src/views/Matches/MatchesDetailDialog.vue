<template>
    <v-dialog v-bind="vDialogProps" v-model="showDialog" fullscreen persistent>
        <v-container>
            <v-layout>

            </v-layout>
        </v-container>
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
                matchMaxParticipants: 0,
                isMatchLoading: false,
            }
        },
        computed: {
            name() {
                return this.data;
            }
        },
        methods: {
            async saveMatch() {
                await MatchApi.requests.getMatch(this.matchUuid)
                    .then(response => {
                        this.setMatchData(response.data);
                    });
            },
            setMatchData(match) {
                if (match) {
                    this.matchId = match.id;
                    this.matchName = match.name;
                    this.matchMaxParticipants = match.max_participants;
                } else {
                    this.matchId = 0;
                    this.matchName = '';
                    this.matchMaxParticipants = 0;
                }
            },
        },
    }
</script>

<style scoped>

</style>