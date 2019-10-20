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
                <b-button size="lg" :disabled="loading" type="submit" variant="primary" block>
                  <b-spinner v-if="loading" small class="align-middle" />
                  <template v-else>Войти</template>
                </b-button>
              </div>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

export default {
  data() {
    return {
      email: null,
      password: null,
      show: false
    }
  },

  methods: {
    sign() {
      this.$store.dispatch('signIn', {
        email: this.email,
        password: this.password
      })
    }
  },

  computed: {
    loading() {
      return this.$store.getters.loading
    },
    signed() {
      return this.$store.getters.signed
    }
  },

  watch: {
    signed() {
      if (this.signed)
        this.$router.replace(this.$route.query.redirect || '/')
    }
  },
}
</script>

<style lang="scss" scoped>
</style>