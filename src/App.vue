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

@Component({
  components: { Navbar }
})
export default class App extends Vue {
  get toastMsg(): any {
    return this.$store.state.toastMsg
  }

  @Watch('toastMsg')
  onToastMsgChange(): void {
    if (this.toastMsg) this.toast()
  }

  async toast(): Promise<void> {
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

  // beforeCreate() {
  //   if (this.$store.state.subjects === null && this.$store.state.user.uid)
  //     this.$store.dispatch(BIND_SUBJECTS)
  // }
}
</script>
