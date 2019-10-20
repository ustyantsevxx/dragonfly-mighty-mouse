<template>
  <b-container>
    <b-row align-h="center">
      <b-col lg="7" xl="8" class="mb-3">
        <b-card class="p-3">
          <h1>Профиль</h1>
          <hr />
          <b-form>
            <b-form-group label="Имя" label-for="name-field">
              <b-form-input id="name-field" required placeholder="Ваше имя" v-model="name" />
            </b-form-group>

            <b-form-group label="Фамилия" label-for="surname-field">
              <b-form-input
                id="surname-field"
                required
                placeholder="Ваша фамилия"
                v-model="surname"
              />
            </b-form-group>

            <b-form-group>
              <template #label>
                <div>
                  <label for="email-field" class="m-0">Эл. почта</label>
                  &nbsp;
                  <b-link v-if="!emailVerified" @click.prevent="verifyEmail">Отправить подтверждение</b-link>
                </div>
              </template>

              <b-form-input id="email-field" required placeholder="Ваша почта" v-model="email" />
            </b-form-group>

            <b-btn variant="success" block class="mt-2" @click="updateData">Сохранить</b-btn>
          </b-form>
        </b-card>
      </b-col>
      <b-col lg="5" xl="4">
        <b-card class="p-3">
          <h1>Смена пароля</h1>
          <hr />
          <b-form>
            <b-form-group label="Старый пароль" label-for="old-pass-field">
              <b-form-input id="old-pass-field" required />
            </b-form-group>

            <b-form-group label="Новый пароль" label-for="new-pass-field">
              <b-form-input id="new-pass-field" required v-model="newPassword" />
            </b-form-group>

            <b-form-group label="Новый пароль еще раз" label-for="confirm-new-pass-field">
              <b-form-input id="confirm-new-pass-field" required />
            </b-form-group>

            <b-btn variant="info" block @click="updatePassword">Сохранить</b-btn>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      surname: '',
      email: '',
      newPassword: ''
    }
  },

  computed: {
    userData() {
      return this.$store.getters.userData
    },
    emailVerified() {
      return this.$store.getters.emailVerified
    }
  },

  methods: {
    updateData() {
      this.$store.dispatch('updateData', {
        name: this.name,
        surname: this.surname
      })
    },
    updatePassword() {
      this.$store.dispatch('updatePassword', this.newPassword)
    },
    verifyEmail() {
      this.$store.dispatch('verifyEmail')
    }
  },


  beforeMount() {
    this.name = this.userData.name
    this.email = this.userData.email
    this.surname = this.userData.surname
  }
}
</script>

<style>
.badge {
  cursor: pointer;
}
</style>