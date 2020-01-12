<template>
  <b-card class="p-3 shadow-sm border-0">
    <b-form-radio-group
      @change="resetData"
      v-model="selectedRadio"
      buttons
      :options="options"
      button-variant="light"
    />
    <b-form class="mt-3">
      <b-form-group v-if="selectedRadio === 'email'">
        <template #label>
          <div>
            <label for="email-field" class="m-0">Эл. почта</label>
            &nbsp;
            <b-link v-if="!emailVerified" @click.prevent="verifyEmail"
              >Отправить подтверждение</b-link
            >
          </div>
        </template>

        <b-form-input
          id="email-field"
          placeholder="Ваша почта"
          :state="inputState($v.email)"
          v-model.trim="$v.email.$model"
        />
      </b-form-group>
      <template v-else>
        <b-form-group label="Новый пароль" label-for="password-field">
          <b-form-input
            id="password-field"
            type="password"
            :state="inputState($v.p.newPassword)"
            v-model.trim="$v.p.newPassword.$model"
          />
          <b-form-invalid-feedback v-if="!$v.p.newPassword.minLength"
            >Пароль не короче 6 символов!</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group
          label="Подтвердите новый пароль"
          label-for="confirm-field"
        >
          <b-form-input
            id="confirm-field"
            type="password"
            :state="inputState($v.p.confirmPassword)"
            v-model.trim="$v.p.confirmPassword.$model"
          />
          <b-form-invalid-feedback v-if="!$v.p.confirmPassword.same"
            >Пароли должны совпадать!</b-form-invalid-feedback
          >
        </b-form-group>
      </template>
      <hr />

      <b-form-group label="Текущий пароль" label-for="old-password-field">
        <b-form-input
          id="old-password-field"
          type="password"
          :state="inputState($v.oldPassword)"
          v-model.trim="$v.oldPassword.$model"
        />
      </b-form-group>

      <btn-loader
        variant="dark"
        block
        @click="updateData"
        :disabled="isInvalid || $v.oldPassword.$invalid"
        load="updatePassBtn"
        or="Обновить"
      />
    </b-form>
  </b-card>
</template>

<script>
import { minLength, required, sameAs, email } from 'vuelidate/lib/validators'
import BtnLoader from '../components/BtnLoader';

export default {
  components: { BtnLoader },

  beforeMount() { this.email = this.userData.email },

  data: () => ({
    selectedRadio: 'email',
    email: null,
    emailJustChanged: false,
    p: {
      newPassword: null,
      confirmPassword: null,
    },
    oldPassword: null,
    options: [
      { text: 'Эл. почта', value: 'email', selected: true },
      { text: 'Пароль', value: 'password' },
    ]
  }),


  validations: {
    oldPassword: { required },
    p: {
      newPassword: { required, minLength: minLength(6) },
      confirmPassword: { required, same: sameAs('newPassword') },
    },
    email: { required, email }
  },


  computed: {
    emailVerified() {
      return this.$store.getters.emailVerified || this.emailJustChanged
    },

    userData() { return this.$store.getters.userData },

    isInvalid() {
      if (this.selectedRadio === 'email')
        return this.$v.email.$invalid || this.email === this.userData.email
      else return this.$v.p.$invalid
    },

    inputState: () => val => val.$dirty ? !val.$error : null
  },


  methods: {
    async updateData() {
      let success
      if (this.selectedRadio === 'password') {
        success = await this.$store.dispatch('updatePassword', {
          old: this.oldPassword,
          new: this.p.newPassword
        })
      }
      else {
        success = await this.$store.dispatch('updateEmail', {
          password: this.oldPassword,
          newEmail: this.email
        })
        if (success) this.emailJustChanged = true
      }
      if (!success) this.oldPassword = null
    },

    verifyEmail() { this.$store.dispatch('verifyEmail') },

    resetData() {
      this.email = this.userData.email
      this.p.newPassword = null
      this.p.confirmPassword = null
      this.$v.$reset()
    }
  },


  watch: {
    email() {
      if (this.email === this.userData.email)
        this.$v.email.$reset()
    }
  }
}
</script>