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


  methods: {
    async toast(err) {
      this.$bvToast.toast(await this.translate(err ? this.error : this.success), {
        variant: err ? 'danger' : 'success',
        solid: true,
        noCloseButton: true,
        toaster: 'b-toaster-top-center',
        bodyClass: 'text-center'
      })
      this.$store.commit(err ? 'unsetError' : 'unsetSuccess')
    },

    async translate(text) {
      const API = process.env.VUE_APP_YANDEX_TRANSLATE_API_KEY
      let resp = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API}&text=${text}&lang=en-ru`)
      resp = await resp.json()
      return resp.text[0]
    },
  },


  watch: {
    error() { if (this.error) this.toast(true) },
    success() { if (this.success) this.toast(false) }
  }
}
</script>

<style>
@font-face {
  font-family: "Source Sans";
  src: url("./assets/source-sans.ttf");
}

* {
  font-family: "Source Sans", sans-serif;
}

#app {
  height: 100vh;
}

.pointer {
  cursor: pointer !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.17s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

*:disabled {
  cursor: not-allowed !important;
}
</style>
