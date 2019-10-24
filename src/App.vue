<template>
  <div id="app">
    <navbar class="mb-4" />
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Navbar from './components/Navbar';

export default {
  components: {
    Navbar
  },

  computed: {
    error() {
      return this.$store.getters.error
    },
    success() {
      return this.$store.getters.success
    }
  },

  methods: {
    toast(err) {
      this.$bvToast.toast(err ? this.error : this.success, {
        title: err ? 'Произошла ошибка!' : 'Успех!',
        variant: err ? 'danger' : 'success',
        solid: true,
        autoHideDelay: 3000
      })
      this.$store.commit(err ? 'unsetError' : 'unsetSuccess')
    }
  },

  watch: {
    error() {
      if (this.error) this.toast(true)
    },
    success() {
      if (this.success) this.toast(false)
    }
  }
}
</script>

<style lang="scss">
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
  transition: opacity 0.25s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
