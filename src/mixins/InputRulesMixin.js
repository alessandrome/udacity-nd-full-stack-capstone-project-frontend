// define a mixin object
const authMixin = {
    data() {
        return {
            inputRules: {
                required: (val) => !!val || this.$t('error_input_field_required')
            },
        }
    },
    watch: {
        '$auth.token': {
            immediate: true,
            handler(newValue, oldValue) {
                this.loadAuth0Permission();
            }
        }
    },
    methods: {
        can: function (permission) {
            return this.auth0Permissions.indexOf(permission) !== -1;
        },
        async loadAuth0Permission() {
            this.auth0Permissions = await this.$auth.getPermissions();
        },
    }
};

export default authMixin;