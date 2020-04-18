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
            <b-badge v-if="!emailVerified" variant="light">
              <b-link @click.prevent="verifyEmail">Отправить подтверждение</b-link>
            </b-badge>
          </div>
        </template>

        <b-form-input
          id="email-field"
          placeholder="Ваша почта"
          :state="inputState($v.newEmail)"
          v-model.trim="$v.newEmail.$model"
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
          <b-form-invalid-feedback
            v-if="!$v.p.newPassword.minLength"
            v-text="'Пароль не короче 6 символов!'"
          />
        </b-form-group>

        <b-form-group label="Подтвердите новый пароль" label-for="confirm-field">
          <b-form-input
            id="confirm-field"
            type="password"
            :state="inputState($v.p.confirmPassword)"
            v-model.trim="$v.p.confirmPassword.$model"
          />
          <b-form-invalid-feedback
            v-if="!$v.p.confirmPassword.same"
            v-text="'Пароли должны совпадать!'"
          />
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
        v-if="!(isInvalid || $v.oldPassword.$invalid)"
        load="btn__updateAuthData"
        or="Обновить"
      />
    </b-form>
  </b-card>
</template>

<script>
import { minLength, required, sameAs, email } from 'vuelidate/lib/validators'
import BtnLoader from '../components/BtnLoader'
import {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  VERIFY_EMAIL
} from '@/store/actions.type'

export default {
  components: { BtnLoader },

  data: () => ({
    newEmail: null,
    p: {
      newPassword: null,
      confirmPassword: null,
    },
    oldPassword: null,
    emailJustChanged: false,
    selectedRadio: 'email',
    options: [
      { text: 'Эл. почта', value: 'email', selected: true },
      { text: 'Пароль', value: 'password' },
    ]
  }),

  computed: {
    emailVerified() {
      return this.$store.state.user.emailVerified || this.emailJustChanged
    },
    email() { return this.$store.state.user.email },
    isInvalid() {
      if (this.selectedRadio === 'email')
        return this.$v.newEmail.$invalid || this.newEmail === this.email
      else return this.$v.p.$invalid
    },
    inputState: () => val => val.$dirty ? !val.$error : null
  },

  watch: {
    newEmail() {
      if (this.newEmail === this.email)
        this.$v.newEmail.$reset()
    }
  },

  beforeMount() {
    this.newEmail = this.email
  },

  methods: {
    async updateData() {
      let success
      if (this.selectedRadio === 'password') {
        success = await this.$store.dispatch(UPDATE_PASSWORD, {
          old: this.oldPassword,
          new: this.p.newPassword
        })
      }
      else {
        success = await this.$store.dispatch(UPDATE_EMAIL, {
          password: this.oldPassword,
          newEmail: this.newEmail
        })
        if (success) this.emailJustChanged = true
      }
      if (!success) this.oldPassword = null
    },
    verifyEmail() {
      this.$store.dispatch(VERIFY_EMAIL)
    },
    resetData() {
      this.newEmail = this.email
      this.p.newPassword = null
      this.p.confirmPassword = null
      this.$v.$reset()
    }
  },

  validations: {
    newEmail: { required, email },
    p: {
      newPassword: { required, minLength: minLength(6) },
      confirmPassword: { required, same: sameAs('newPassword') },
    },
    oldPassword: { required }
  }
}
</script>