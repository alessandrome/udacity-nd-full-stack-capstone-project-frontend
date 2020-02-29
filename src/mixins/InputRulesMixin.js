// define a mixin object
const authMixin = {
    data() {
        return {
            inputRules: {
                required: (val) => !!val || this.$t('error_input_field_required')
            },
        }
    },
};

export default authMixin;