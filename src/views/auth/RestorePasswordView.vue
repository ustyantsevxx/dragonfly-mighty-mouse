<template>
  <main>
    <b-container>
      <b-row align-h="center">
        <b-col sm="12" md="8" lg="7" xl="6">
          <b-card class="p-3 shadow-sm border-0">
            <h2 class="mb-4 text-center">Восстановление пароля</h2>
            <b-form @submit.prevent="restorePassword">
              <b-form-group label="Эл. почта">
                <b-form-input type="email" required v-model="email" />
              </b-form-group>
              <div class="mt-4">
                <btn-loader
                  size="lg"
                  type="submit"
                  variant="info"
                  block
                  load="btn__restorePassword"
                  or="Отправить ссылку"
                />
              </div>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import BtnLoader from '@/components/BtnLoader'
import { RESTORE_PASSWORD } from '@/store/actions.type'

export default {
  components: { BtnLoader },
  data: () => ({
    email: null
  }),
  methods: {
    async restorePassword() {
      let r = await this.$store.dispatch(RESTORE_PASSWORD, { email: this.email })
      if (r) this.$router.push('/login')
    }
  }
}
</script>