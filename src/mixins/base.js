export default state => {
  return {
    data: () => ({ ...state }),

    computed: {
      inputState: () => val => val.$dirty ? !val.$error : null
    },

    methods: {
      resetData() {
        Object.assign(this.$data, state)
        this.$v.$reset()
      },
      resetModal(modalRef) {
        this.resetData()
        this.$refs[modalRef].hide()
        this.$v.$reset()
      },
    }
  }
}