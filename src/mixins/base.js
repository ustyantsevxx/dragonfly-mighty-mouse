import { isMobile } from '@/assets/functions'

export default state => {
  return {
    data: () => ({
      ...state
    }),

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
        this.$bvModal.hide(modalRef)
        this.$v.$reset()
      },
      isMobile: () => isMobile()
    }
  }
}