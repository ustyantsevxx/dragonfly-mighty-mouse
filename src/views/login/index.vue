<template>
  <main>
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
                <loading-button
                  @click="sign"
                  size="lg"
                  variant="primary"
                  block
                  :load="loadLogin"
                >
                  Войти
                </loading-button>
              </div>
              <div class="mt-2 d-flex justify-content-between">
                <b-link to="/restore">Забыли пароль?</b-link>
                <b-link to="/register">Первый раз?</b-link>
              </div>
              <!-- <div class="app__separator">или</div>
              <div>
                <loading-button
                  @click="googleSignIn"
                  variant="light"
                  block
                  :disabled="!!loading"
                  :load="loadGoogleLogin"
                >
                  <img class="app__google_img" src="@/assets/images/glogo.webp" />
                </loading-button>
              </div>-->
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import LoadingButton from '@/components/LoadingButton.vue'
import { UserModule } from '@/store/modules/user'

@Component({ components: { LoadingButton } })
export default class extends Vue {
  email = ''
  password = ''
  loadLogin = false
  loadGoogleLogin = false

  get signed() {
    return this.$store.state.user.uid
  }

  @Watch('signed')
  onSignedChange() {
    if (this.signed) location.replace((this.$route.query.next as string) ?? '/')
  }

  async sign() {
    this.loadLogin = true
    const signed = await UserModule.Login({
      email: this.email,
      password: this.password
    })
    this.loadLogin = false
    if (!signed) this.password = ''
  }

  async googleSignIn() {
    this.loadGoogleLogin = true
    await UserModule.LoginWithGoogle()
    this.loadGoogleLogin = false
  }
}
</script>

<style lang="scss" scoped>
.app__google_img {
  height: 1.5em;
}

.app__separator {
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
