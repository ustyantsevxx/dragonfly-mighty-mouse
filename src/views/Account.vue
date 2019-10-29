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

            <btn-loader
              variant="success"
              block
              class="mt-2"
              :disabled="notChanged"
              @click="updateData"
              load="updateDataBtn"
              or="Сохранить"
            />
          </b-form>
        </b-card>
      </b-col>

      <b-col lg="5" xl="4">
        <password-change />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// FIXME: пофиксить проверку после смены имени, т.к можно сменить еще раз после смены

import PasswordChange from '../components/PasswordChange'
import BtnLoader from '../components/BtnLoader'

export default {
  components: {
    PasswordChange,
    BtnLoader
  },

  data() {
    return {
      name: '',
      surname: '',
      email: ''
    }
  },

  computed: {
    userData() {
      return this.$store.getters.userData
    },
    emailVerified() {
      return this.$store.getters.emailVerified
    },
    notChanged() {
      return this.userData.name === this.name &&
        this.userData.surname === this.surname &&
        this.userData.email === this.email
    }
  },


  methods: {
    updateData() {
      this.$store.dispatch('updateData', {
        name: this.name,
        surname: this.surname
      })
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
</style>
