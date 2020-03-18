<template>
  <b-container>
    <b-row align-h="center">
      <b-col sm="10" md="7" lg="6" xl="5">
        <b-card class="p-3 shadow-sm border-0">
          <h2 class="mb-4 text-center">Вход в систему</h2>
          <b-form @keydown.enter="sign">
            <b-form-group label="Эл. почта">
              <b-form-input type="email" required v-model="email" />
            </b-form-group>

            <b-form-group label="Пароль">
              <b-form-input type="password" required v-model="password" />
            </b-form-group>

            <div class="mt-4">
              <btn-loader
                @click="sign"
                size="lg"
                variant="primary"
                block
                :disabled="!!loading"
                load="btn__signIn"
                or="Войти"
              />
            </div>
            <div class="mt-2 d-flex justify-content-between">
              <b-link to="/restore">Забыли пароль?</b-link>
              <b-link to="/register">Первый раз?</b-link>
            </div>
            <!-- <div class="separator">или</div>
            <div>
              <btn-loader
                @click="googleSignIn"
                variant="light"
                block
                :disabled="!!loading"
                load="btn-googleSign"
              >
                <img src="@/assets/glogo.webp" />
              </btn-loader>
            </div>-->
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import BtnLoader from '@/components/BtnLoader'

export default {
  components: { BtnLoader },

  data: () => ({
    email: null,
    password: null
  }),

  computed: {
    signed() { return this.$store.state.user.uid },
    loading() { return this.$store.state.loadingView }
  },

  watch: {
    signed() {
      if (this.signed)
        location.replace(this.$route.query.next || '/')
    }
  },

  methods: {
    async sign() {
      let signed = await this.$store.dispatch('signIn', {
        email: this.email,
        password: this.password
      })
      if (!signed) this.password = null
    },
    googleSignIn() {
      this.$store.dispatch('googleSignIn')
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  height: 1.5em;
}
.separator {
  margin-bottom: 4px;
  display: flex;
  color: rgba(0, 0, 0, 0.2);
  align-items: center;
  text-align: center;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  &::before {
    margin-right: 0.2em;
  }
  &::after {
    margin-left: 0.2em;
  }
}
</style>