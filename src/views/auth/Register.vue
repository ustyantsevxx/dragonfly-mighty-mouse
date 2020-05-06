<template>
  <main>
    <b-container>
      <b-row align-h="center">
        <b-col sm="12" md="8" lg="7" xl="6">
          <b-card class="p-3 shadow-sm border-0">
            <h2 class="mb-4 text-center">Регистрация</h2>
            <b-form @submit.prevent="signUp">
              <b-form-group label="Имя">
                <b-form-input
                  :state="inputState($v.name)"
                  v-model.trim="$v.name.$model"
                />
              </b-form-group>

              <b-form-group label="Фамилия">
                <b-form-input
                  :state="inputState($v.surname)"
                  v-model.trim="$v.surname.$model"
                />
              </b-form-group>

              <hr class="mt-4" />

              <b-form-group label="Эл. почта">
                <b-form-input
                  type="email"
                  :state="inputState($v.email)"
                  v-model.trim="$v.email.$model"
                />
                <b-form-invalid-feedback
                  v-if="!$v.email.email"
                  v-text="'Некорректный формат почты!'"
                />
              </b-form-group>

              <b-form-group label="Пароль">
                <b-form-input
                  type="password"
                  :state="inputState($v.password)"
                  v-model.trim="$v.password.$model"
                />
                <b-form-invalid-feedback
                  v-if="!$v.password.minLength"
                  v-text="'Пароль не короче 6 символов!'"
                />
              </b-form-group>

              <b-form-group label="Подтвердите пароль">
                <b-form-input
                  type="password"
                  :state="inputState($v.confirmPassword)"
                  v-model.trim="$v.confirmPassword.$model"
                />
                <b-form-invalid-feedback
                  v-if="!$v.confirmPassword.same"
                  v-text="'Пароли должны совпадать!'"
                />
              </b-form-group>

              <b-radio-group v-model="isTeacher">
                <b-radio :value="false">Студент</b-radio>
                <b-radio :value="true">Преподаватель</b-radio>
              </b-radio-group>

              <div class="mt-4 mb-2">
                <loading-button
                  size="lg"
                  :disabled="$v.$invalid"
                  type="submit"
                  variant="success"
                  block
                  :load="loadRegister"
                >
                  Зарегистрироваться
                </loading-button>
              </div>

              <b-link to="/login">Уже зарегистрированы?</b-link>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import { minLength, required, email, sameAs } from 'vuelidate/lib/validators'
import LoadingButton from '@/components/LoadingButton'
import baseMixin from '@/mixins/base'
import { REGISTER } from '@/store/actions.type'

export default {
  components: { LoadingButton },

  mixins: [
    baseMixin({
      name: null,
      surname: null,
      email: null,
      password: null,
      confirmPassword: null,
      isTeacher: false,
      loadRegister: false
    })
  ],

  computed: {
    signed() {
      return this.$store.state.user.uid
    }
  },

  watch: {
    signed() {
      if (this.signed) location.replace('/')
    }
  },

  methods: {
    async signUp() {
      this.loadRegister = true
      await this.$store.dispatch(REGISTER, {
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        isTeacher: this.isTeacher
      })
      this.loadRegister = false
    }
  },

  validations: {
    name: { required },
    surname: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    confirmPassword: { required, same: sameAs('password') }
  }
}
</script>
