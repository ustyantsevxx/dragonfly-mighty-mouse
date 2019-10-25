<template>
  <div>
    <b-container>
      <b-row align-h="center" class="mt-5">
        <b-col sm="12" md="8" lg="7" xl="6">
          <b-card class="p-3">
            <h2 class="mb-4 text-center">Регистрация</h2>
            <b-form @submit.prevent="signUp">
              <b-form-group label="Ваше имя" label-for="name-field">
                <b-form-input
                  id="name-field"
                  :state="$v.name.$dirty ? !$v.name.$error : null"
                  v-model.trim="$v.name.$model"
                />
              </b-form-group>

              <b-form-group label="Ваша фамилия" label-for="surname-field">
                <b-form-input
                  id="surname-field"
                  :state="$v.surname.$dirty ? !$v.surname.$error : null"
                  v-model.trim="$v.surname.$model"
                />
              </b-form-group>

              <hr />

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
                  :state="$v.confirmPassword.$dirty ? !$v.confirmPassword.$error : null"
                  v-model.trim="$v.confirmPassword.$model"
                />
                <b-form-invalid-feedback v-if="!$v.confirmPassword.same">Пароли должны совпадать!</b-form-invalid-feedback>
              </b-form-group>

              <div class="mt-4">
                <b-button
                  size="lg"
                  :disabled="loading || $v.$invalid"
                  type="submit"
                  variant="success"
                  block
                >
                  <b-spinner v-if="loading" />
                  <template v-else>Зарегистрироваться</template>
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
import { minLength, required, email, sameAs } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      name: null,
      surname: null,
      email: null,
      password: null,
      confirmPassword: null,
    }
  },

  validations: {
    name: {
      required
    },
    surname: {
      required
    },
    email: {
      email,
      required
    },
    password: {
      required,
      minLength: minLength(6)
    },
    confirmPassword: {
      required,
      same: sameAs('password')
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
      if (this.signed) {
        this.$router.replace('/')
        this.$store.commit('unsetLoading')
      }
    }
  },
}
</script>