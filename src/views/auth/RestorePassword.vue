<template>
  <div>
    <b-container>
      <b-row align-h="center">
        <b-col sm="12" md="8" lg="7" xl="6">
          <b-card class="p-3">
            <h2 class="mb-4 text-center">Восстановление пароля</h2>
            <b-form @submit.prevent="restorePassword">
              <b-form-group label="Эл. почта" label-for="email-field">
                <b-form-input
                  id="email-field"
                  type="email"
                  required
                  v-model="email"
                />
              </b-form-group>

              <div class="mt-4">
                <btn-loader
                  size="lg"
                  type="submit"
                  variant="info"
                  block
                  load="restoreBtn"
                  or="Отправить ссылку"
                />
              </div>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import BtnLoader from '@/components/BtnLoader'

export default {
  components: { BtnLoader },

  data: () => ({ email: null }),

  computed: {
    loadingView() { return this.$store.getters.loadingView },
    signed() { return this.$store.getters.signed }
  },

  methods: {
    async restorePassword() {
      let r = await this.$store.dispatch('recoverPassword', { email: this.email })
      if (r) this.$router.push('/login')
    }
  }
}
</script>