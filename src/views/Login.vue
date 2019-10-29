<template>
  <div>
    <b-container>
      <b-row align-h="center" class="mt-5">
        <b-col sm="10" md="7" lg="6" xl="5">
          <b-card class="p-3">
            <h2 class="mb-4 text-center">Вход в систему</h2>
            <b-form @submit.prevent="sign">
              <b-form-group label="Эл. почта" label-for="email-field">
                <b-form-input id="email-field" type="email" required v-model="email" />
              </b-form-group>

              <b-form-group label="Пароль" label-for="password-field">
                <b-form-input id="password-field" type="password" required v-model="password" />
              </b-form-group>

              <div class="mt-4">
                <btn-loader
                  size="lg"
                  type="submit"
                  variant="primary"
                  block
                  load="loginBtn"
                  or="Войти"
                />
              </div>
              <!-- todo: лучше для этого сделать отдельный комп. чтобы нормально отображать загрузку и прочее.. -->
              <div class="mt-2">
                <b-link @click.prevent="recoverPassword">Забыли пароль?</b-link>
              </div>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import BtnLoader from '../components/BtnLoader'

export default {
  components: { BtnLoader },

  data() {
    return {
      email: null,
      password: null,
    }
  },

  methods: {
    sign() {
      this.$store.dispatch('signIn', {
        email: this.email,
        password: this.password
      })
    },
    recoverPassword() {
      this.$store.dispatch('recoverPassword', {
        email: this.email
      })
    }
  },

  computed: {
    loadingView() {
      return this.$store.getters.loadingView
    },
    signed() {
      return this.$store.getters.signed
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