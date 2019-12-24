<template>
  <div>
    <b-container>
      <b-row align-h="center">
        <b-col sm="10" md="7" lg="6" xl="5">
          <b-card class="p-3">
            <h2 class="mb-4 text-center">Вход в систему</h2>
            <b-form @keydown.enter="sign">
              <b-form-group label="Эл. почта" label-for="email-field">
                <b-form-input id="email-field" type="email" required v-model="email" />
              </b-form-group>

              <b-form-group label="Пароль" label-for="password-field">
                <b-form-input id="password-field" type="password" required v-model="password" />
              </b-form-group>

              <div class="mt-4">
                <btn-loader
                  @click="sign"
                  size="lg"
                  variant="primary"
                  block
                  load="loginBtn"
                  or="Войти"
                />
              </div>

              <div class="mt-2 d-flex justify-content-between">
                <b-link to="/restore">Забыли пароль?</b-link>
                <b-link to="/register">Первый раз?</b-link>
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

  data() {
    return {
      email: null,
      password: null,
    }
  },


  computed: {
    loadingView() { return this.$store.getters.loadingView },
    signed() { return this.$store.getters.signed }
  },


  methods: {
    async sign() {
      let signed = await this.$store.dispatch('signIn', {
        email: this.email,
        password: this.password
      })
      if (!signed) this.password = null
    }
  },


  watch: {
    signed() {
      if (this.signed) {
        this.$router.replace(this.$route.query.redirect || '/')
        this.$store.commit('unsetLoading')
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>