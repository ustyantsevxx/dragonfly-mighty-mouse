<template>
  <div id="app">
    <navbar class="mb-3" />
    <transition name="global-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import Navbar from './components/TheNavbar'
import { BIND_SUBJECTS } from '@/store/actions.type'

export default {
  components: { Navbar },

  computed: {
    toastMsg() {
      return this.$store.state.toastMsg
    }
  },

  watch: {
    toastMsg() {
      if (this.toastMsg) this.toast()
    }
  },

  beforeCreate() {
    if (this.$store.state.subjects === null && this.$store.state.user.uid)
      this.$store.dispatch(BIND_SUBJECTS)
  },

  methods: {
    async toast() {
      let russianMsg = this.toastMsg.translate
        ? await this.translate(this.toastMsg.msg)
        : this.toastMsg.msg
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
      const API = process.env.VUE_APP__YANDEX_TRANSLATE_API_KEY
      try {
        const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API}&text=${text}&lang=en-ru`
        let resp = await fetch(url)
        resp = await resp.json()
        return resp.text.join(' ')
      } catch {
        return text
      }
    }
  }
}
</script>
