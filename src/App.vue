<template>
  <div id="app">
    <navbar class="mb-3" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Navbar from './components/Navbar'

export default {
  components: { Navbar },

  computed: {
    toastMsg() { return this.$store.getters.toastMsg }
  },

  watch: {
    toastMsg() { if (this.toastMsg) this.toast() },
  },

  methods: {
    async toast(isError) {
      let russianMsg = await this.translate(this.toastMsg.msg)
      this.$bvToast.toast(russianMsg, {
        variant: this.toastMsg.error ? 'danger' : 'success',
        solid: true,
        noCloseButton: true,
        toaster: 'b-toaster-top-center',
        toastClass: 'border-0',
        bodyClass: 'text-center'
      })
      this.$store.commit('unsetToastMsg')
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