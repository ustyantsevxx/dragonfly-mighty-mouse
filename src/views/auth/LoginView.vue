<template>
  <main>
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="card">
            <div class="card-header">
              <div class="card-header-title is-centered">
                <h1 class="title">Вход в систему</h1>
              </div>
            </div>
            <div class="card-content">
              <b-field label="Эл. почта">
                <b-input type="email" required v-model="email" />
              </b-field>

              <b-field label="Пароль">
                <b-input type="password" required v-model="password" />
              </b-field>

              <div class="mt-4">
                <btn-loader
                  @click="sign"
                  type="is-primary"
                  expanded
                  :disabled="!!loading"
                  load="btn__signIn"
                  or="Войти"
                />
              </div>
            </div>
            <div class="card-footer">
              <div class="card-footer-item">
                <router-link to="/restore">
                  Забыли пароль?
                </router-link>
              </div>
              <div class="card-footer-item">
                <router-link to="/register">
                  Первый раз?
                </router-link>
              </div>
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
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import BtnLoader from '@/components/BtnLoader'
import { LOGIN, LOGIN_WITH_GOOGLE } from '@/store/actions.type'

export default {
  components: { BtnLoader },

  data: () => ({
    email: null,
    password: null
  }),

  computed: {
    signed() {
      return this.$store.state.user.uid
    },
    loading() {
      return this.$store.state.loadingView
    }
  },

  watch: {
    signed() {
      if (this.signed) location.replace(this.$route.query.next || '/')
    }
  },

  methods: {
    async sign() {
      let signed = await this.$store.dispatch(LOGIN, {
        email: this.email,
        password: this.password
      })
      if (!signed) this.password = null
    },
    googleSignIn() {
      this.$store.dispatch(LOGIN_WITH_GOOGLE)
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
    content: '';
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
