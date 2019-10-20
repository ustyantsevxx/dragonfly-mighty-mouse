<template>
  <div>
    <b-container>
      <b-row align-h="center" class="mt-5">
        <b-col sm="12" md="8" lg="7" xl="6">
          <b-card class="p-3">
            <h2 class="mb-4 text-center">Регистрация</h2>
            <b-form @submit.prevent="signUp">
              <b-form-group label="Ваше имя" label-for="name-field">
                <b-form-input id="name-field" required v-model="newUserData.name" />
              </b-form-group>

              <b-form-group label="Ваша фамилия" label-for="surname-field">
                <b-form-input id="surname-field" required v-model="newUserData.surname" />
              </b-form-group>

              <hr />

              <b-form-group label="Эл. почта" label-for="email-field">
                <b-form-input id="email-field" type="email" required v-model="newUserData.email" />
              </b-form-group>

              <b-form-group label="Пароль" label-for="password-field">
                <b-form-input
                  id="password-field"
                  type="password"
                  required
                  v-model="newUserData.password"
                />
              </b-form-group>

              <b-form-group label="Подтвердите пароль" label-for="confirm-field">
                <b-form-input
                  id="confirm-field"
                  type="password"
                  required
                  v-model="newUserData.confirmPassword"
                />
              </b-form-group>

              <div class="mt-4">
                <b-button size="lg" :disabled="loading" type="submit" variant="success" block>
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
export default {
  data() {
    return {
      newUserData: {
        name: null,
        surname: null,
        email: null,
        password: null,
        confirmPassword: null,
      }
    }
  },

  methods: {
    signUp() {
      this.$store.dispatch('signUp', this.newUserData)
    }
  },

  computed: {
    loading() {
      return this.$store.getters.loading
    },
    uid() {
      return this.$store.getters.uid
    },
    we() {
      return alert(1)
    }
  },

  watch: {
    uid() {
      if (this.uid !== null)
        this.$router.replace('/')
    }
  },
}
</script>