// define a mixin object
const vDialogComponentMixin = {
    props: {
        value: {},
        vDialogProps: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        showDialog: {
            get() {
                return this.value;
            },
            set(v) {
                this.$emit('input', v);
            }
        },
    },
};

export default vDialogComponentMixin;