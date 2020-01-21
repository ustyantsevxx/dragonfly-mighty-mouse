<template>
  <div id="app">
    <navbar class="mb-3" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Navbar from './components/Navbar'

export default {
  components: { Navbar },

  computed: {
    ...mapGetters(['error', 'success'])
  },

  watch: {
    error() { if (this.error) this.toast(true) },
    success() { if (this.success) this.toast(false) }
  },

  methods: {
    async toast(isError) {
      let russianMsg = await this.translate(isError ? this.error : this.success)
      this.$bvToast.toast(russianMsg, {
        variant: isError ? 'danger' : 'success',
        solid: true,
        noCloseButton: true,
        toaster: 'b-toaster-top-center',
        toastClass: 'border-0',
        bodyClass: 'text-center'
      })
      this.$store.commit(isError ? 'unsetError' : 'unsetSuccess')
    },
    async translate(text) {
      const API = process.env.VUE_APP_YANDEX_TRANSLATE_API_KEY
      let resp = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API}&text=${text}&lang=en-ru`)
      resp = await resp.json()
      return resp.text.join(' ')
    }
  }
}
</script>