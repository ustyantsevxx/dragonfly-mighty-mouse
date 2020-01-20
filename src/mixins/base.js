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
      }
    }
  }
}