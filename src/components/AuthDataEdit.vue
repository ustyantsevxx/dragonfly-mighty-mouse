<template>
  <b-card class="p-3">
    <h2>Данные для входа</h2>
    <hr />
    <b-form-radio-group
      @change="resetData"
      v-model="selectedRadio"
      buttons
      :options="options"
      button-variant="warning"
    />
    <b-form class="mt-3">
      <b-form-group>
        <template #label>
          <div>
            <label for="email-field" class="m-0">Эл. почта</label>
            &nbsp;
            <b-link v-if="!emailVerified" @click.prevent="verifyEmail">Отправить подтверждение</b-link>
          </div>
        </template>

        <b-form-input
          :disabled="selectedRadio !== 'email'"
          id="email-field"
          placeholder="Ваша почта"
          :state="$v.email.$dirty ? !$v.email.$error : null"
          v-model.trim="$v.email.$model"
        />
      </b-form-group>

      <b-form-group label="Новый пароль" label-for="password-field">
        <b-form-input
          id="password-field"
          type="password"
          :state="$v.p.newPassword.$dirty ? !$v.p.newPassword.$error : null"
          v-model.trim="$v.p.newPassword.$model"
          :disabled="selectedRadio !== 'password'"
        />
        <b-form-invalid-feedback v-if="!$v.p.newPassword.minLength">Пароль не короче 6 символов!</b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Подтвердите новый пароль" label-for="confirm-field">
        <b-form-input
          id="confirm-field"
          type="password"
          :state="$v.p.confirmPassword.$dirty ? !$v.p.confirmPassword.$error : null"
          v-model.trim="$v.p.confirmPassword.$model"
          :disabled="selectedRadio !== 'password'"
        />
        <b-form-invalid-feedback v-if="!$v.p.confirmPassword.same">Пароли должны совпадать!</b-form-invalid-feedback>
      </b-form-group>

      <hr />

      <b-form-group label="Текущий пароль" label-for="old-password-field">
        <b-form-input
          id="old-password-field"
          type="password"
          :state="$v.oldPassword.$dirty ? !$v.oldPassword.$error : null"
          v-model.trim="$v.oldPassword.$model"
        />
      </b-form-group>

      <btn-loader
        variant="danger"
        block
        @click="updateData"
        :disabled="isInvalid() || $v.oldPassword.$invalid"
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
  components: {
    BtnLoader
  },

  data() {
    return {
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
    }
  },

  computed: {
    emailVerified() {
      return this.$store.getters.emailVerified || this.emailJustChanged
    },
    userData() {
      return this.$store.getters.userData
    },
  },

  beforeMount() {
    this.email = this.userData.email
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
    verifyEmail() {
      this.$store.dispatch('verifyEmail')
    },
    resetData() {
      this.email = this.userData.email
      this.p.newPassword = null
      this.p.confirmPassword = null
      this.$v.$reset()
    },
    isInvalid() {
      if (this.selectedRadio === 'email')
        return this.$v.email.$invalid || this.email === this.userData.email
      else
        return this.$v.p.$invalid
    }
  },

  watch: {
    email() {
      if (this.email === this.userData.email)
        this.$v.email.$reset()
    }
  },

  validations: {
    oldPassword: {
      required
    },
    p: {
      newPassword: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        required,
        same: sameAs('newPassword')
      },
    },
    email: {
      required,
      email
    }
  }
}
</script>