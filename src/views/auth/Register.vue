<template>
  <b-container>
    <b-row align-h="center">
      <b-col sm="12" md="8" lg="7" xl="6">
        <b-card class="p-3 shadow-sm border-0">
          <h2 class="mb-4 text-center">Регистрация</h2>
          <b-form @submit.prevent="signUp">
            <b-form-group label="Имя" label-for="name-field">
              <b-form-input
                id="name-field"
                :state="$v.name.$dirty ? !$v.name.$error : null"
                v-model.trim="$v.name.$model"
              />
            </b-form-group>

            <b-form-group label="Фамилия" label-for="surname-field">
              <b-form-input
                id="surname-field"
                :state="$v.surname.$dirty ? !$v.surname.$error : null"
                v-model.trim="$v.surname.$model"
              />
            </b-form-group>

            <hr class="mt-4" />

            <b-form-group label="Эл. почта" label-for="email-field">
              <b-form-input
                id="email-field"
                type="email"
                :state="$v.email.$dirty ? !$v.email.$error : null"
                v-model.trim="$v.email.$model"
              />
              <b-form-invalid-feedback v-if="!$v.email.email">Некорректный формат почты!</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Пароль" label-for="password-field">
              <b-form-input
                id="password-field"
                type="password"
                :state="$v.password.$dirty ? !$v.password.$error : null"
                v-model.trim="$v.password.$model"
              />
              <b-form-invalid-feedback v-if="!$v.password.minLength">Пароль не короче 6 символов!</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group label="Подтвердите пароль" label-for="confirm-field">
              <b-form-input
                id="confirm-field"
                type="password"
                :state="
                    $v.confirmPassword.$dirty
                      ? !$v.confirmPassword.$error
                      : null
                  "
                v-model.trim="$v.confirmPassword.$model"
              />
              <b-form-invalid-feedback v-if="!$v.confirmPassword.same">Пароли должны совпадать!</b-form-invalid-feedback>
            </b-form-group>

            <div class="mt-4">
              <btn-loader
                size="lg"
                :disabled="$v.$invalid"
                type="submit"
                variant="success"
                block
                load="registerBtn"
                or="Зарегистрироваться"
              />
            </div>

            <div class="mt-2 d-flex justify-content-between">
              <b-link to="/login">Уже зарегистрированы?</b-link>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { minLength, required, email, sameAs } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'

export default {
  components: { BtnLoader },

  data: () => ({
    name: null,
    surname: null,
    email: null,
    password: null,
    confirmPassword: null
  }),

  computed: {
    loadingView() { return this.$store.getters.loadingView },
    signed() { return this.$store.getters.signed }
  },

  watch: {
    signed() {
      if (this.signed) {
        this.$router.replace('/')
        this.$store.commit('unsetLoading')
      }
    }
  },

  methods: {
    signUp() {
      this.$store.dispatch('signUp', {
        name: this.name,
        surname: this.surname,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
      })
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