// define a mixin object
const AuthMixin = {
    data() {
        return {
            auth0Permissions: [],
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
            try {
                this.auth0Permissions = await this.$auth.getPermissions();
            } catch (e) {
                this.auth0Permissions = [];
            }
        },
    }
};

export default AuthMixin;