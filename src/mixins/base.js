export default state => {
  return {
    data: () => ({ ...state }),

    methods: {
      resetData() {
        Object.assign(this.$data, state)
        this.$v.$reset()
      }
    },

    computed: {
      inputState: () => val => val.$dirty ? !val.$error : null
    }
  }
}