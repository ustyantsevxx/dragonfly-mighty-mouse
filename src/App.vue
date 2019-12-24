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
    error() { return this.$store.getters.error },
    success() { return this.$store.getters.success }
  },


  methods: {
    async toast(err) {
      this.$bvToast.toast(await this.translate(err ? this.error : this.success), {
        variant: err ? 'danger' : 'success',
        solid: true,
        noCloseButton: true,
        toaster: 'b-toaster-top-center'
      })
      this.$store.commit(err ? 'unsetError' : 'unsetSuccess')
    },

    async translate(text) {
      const API = 'trnsl.1.1.20191118T060514Z.555d9b2456b8ced9.dcbb713afeab3834d65eb8a6dea8545d5bbd5cf6'
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
  background: #f8f9fa !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.form-control.is-valid,
.was-validated .form-control:valid,
.form-control.is-invalid,
.form-control:invalid {
  background-image: none !important;
}

*:disabled {
  cursor: not-allowed;
}
</style>
