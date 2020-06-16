<template>
  <div id="app">
    <navbar class="mb-3" />
    <transition name="global-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Navbar from '@/components/TheNavbar.vue'
import ToastsModule from './store/toasts.module'

@Component({
  components: { Navbar }
})
export default class App extends Vue {
  // beforeCreate() {
  //   if (this.$store.state.subjects === null && this.$store.state.user.uid)
  //     this.$store.dispatch(BIND_SUBJECTS)
  // }

  get toasted() {
    return ToastsModule.toasted
  }

  @Watch('toasted')
  onToastMsgChange() {
    if (this.toasted) this.toast()
  }

  async toast() {
    let russianMsg = ToastsModule.needsTranslation
      ? await this.translate(ToastsModule.message)
      : ToastsModule.message
    this.$bvToast.toast(russianMsg, {
      variant: ToastsModule.error ? 'danger' : 'success',
      solid: true,
      noCloseButton: true,
      toaster: 'b-toaster-top-center',
      toastClass: 'border-0',
      bodyClass: 'text-center'
    })
    ToastsModule.UnToast()
  }

  async translate(text: string): Promise<string> {
    try {
      const url =
        'https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-ru' +
        `&key=${process.env.VUE_APP__YANDEX_TRANSLATE_API_KEY}&text=${text}`
      const resp = await fetch(url)
      const responseData = await resp.json()
      return responseData.text.join(' ')
    } catch {
      return text
    }
  }
}
</script>
