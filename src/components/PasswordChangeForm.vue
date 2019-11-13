<template>
  <b-card class="p-3">
    <h1>Смена пароля</h1>
    <hr />
    <b-form>
      <b-form-group label="Текущий пароль" label-for="old-password-field">
        <b-form-input
          id="old-password-field"
          type="password"
          :state="$v.oldPassword.$dirty ? !$v.oldPassword.$error : null"
          v-model.trim="$v.oldPassword.$model"
        />
      </b-form-group>

      <b-form-group label="Новый пароль" label-for="password-field">
        <b-form-input
          id="password-field"
          type="password"
          :state="$v.newPassword.$dirty ? !$v.newPassword.$error : null"
          v-model.trim="$v.newPassword.$model"
        />
        <b-form-invalid-feedback v-if="!$v.newPassword.minLength">Пароль не короче 6 символов!</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Подтвердите новый пароль" label-for="confirm-field">
        <b-form-input
          id="confirm-field"
          type="password"
          :state="$v.confirmPassword.$dirty ? !$v.confirmPassword.$error : null"
          v-model.trim="$v.confirmPassword.$model"
        />
        <b-form-invalid-feedback v-if="!$v.confirmPassword.same">Пароли должны совпадать!</b-form-invalid-feedback>
      </b-form-group>
      <btn-loader
        variant="info"
        block
        @click="updatePassword"
        :disabled="$v.$invalid"
        load="updatePassBtn"
        or="Сохранить"
      />
    </b-form>
  </b-card>
</template>

<script>
import { minLength, required, sameAs } from 'vuelidate/lib/validators'
import BtnLoader from '../components/BtnLoader';

export default {
  components: {
    BtnLoader
  },
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      confirmPassword: null
    }
  },
  methods: {
    async updatePassword() {
      let success = await this.$store.dispatch('updatePassword', {
        old: this.oldPassword,
        new: this.newPassword
      })
      if (!success) this.oldPassword = null
    },
  },
  validations: {
    oldPassword: {
      required
    },
    newPassword: {
      required,
      minLength: minLength(6)
    },
    confirmPassword: {
      required,
      same: sameAs('newPassword')
    }
  }
}
</script>