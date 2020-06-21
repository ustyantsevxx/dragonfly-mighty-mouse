<template>
  <b-card class="shadow-sm border-0">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <div class="font-weight-bold">Данные для входа</div>
        <div>
          <b-form-radio-group
            @change="resetData"
            v-model="selectedRadio"
            buttons
            size="sm"
            :options="options"
            button-variant="light"
          />
        </div>
      </div>
    </template>

    <b-form>
      <b-form-group v-if="selectedRadio === 'email'">
        <template #label>
          <div>
            <label for="email-field" class="m-0 mr-2">Эл. почта</label>
            <b-badge v-if="!emailVerified" variant="danger">
              <b-link
                class="text-white"
                href="/verify-email"
                @click.prevent="verifyEmail"
              >
                Отправить подтверждение
              </b-link>
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
          <b-form-invalid-feedback
            v-if="!$v.p.confirmPassword.same"
            v-text="'Пароли должны совпадать!'"
          />
        </b-form-group>
      </template>
    </b-form>

    <template #footer v-if="!isInvalid">
      <b-input-group>
        <b-form-input
          id="old-password-field"
          type="password"
          placeholder="Текущий пароль"
          :state="inputState($v.oldPassword)"
          v-model.trim="$v.oldPassword.$model"
        />
        <template #append>
          <loading-button
            variant="dark"
            block
            :disabled="$v.oldPassword.$invalid"
            @click="updateData"
            :load="loadUpdate"
          >
            Обновить
          </loading-button>
        </template>
      </b-input-group>
    </template>
  </b-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import LoadingButton from '@/components/LoadingButton.vue'
import { minLength, required, sameAs, email } from 'vuelidate/lib/validators'
import { UserModule } from '@/store/modules/user'

@Component({
  components: { LoadingButton },
  validations: {
    newEmail: { required, email },
    p: {
      newPassword: { required, minLength: minLength(6) },
      confirmPassword: { required, same: sameAs('newPassword') }
    },
    oldPassword: { required, minLength: minLength(6) }
  }
})
export default class extends Vue {
  newEmail = ''
  p = {
    newPassword: '',
    confirmPassword: ''
  }
  oldPassword = ''
  selectedRadio = 'email'
  options = [
    { text: 'Эл. почта', value: 'email', selected: true },
    { text: 'Пароль', value: 'password' }
  ]
  loadUpdate = false

  beforeMount() {
    this.newEmail = this.email
  }

  get emailVerified() {
    return UserModule.emailVerified
  }

  get email() {
    return UserModule.email
  }

  get isInvalid() {
    if (this.selectedRadio === 'email')
      return this.$v.newEmail.$invalid || this.newEmail === this.email
    else return this.$v.p.$invalid
  }

  get inputState() {
    return (val: any) => (val.$dirty ? !val.$error : null)
  }

  @Watch('newEmail')
  onNewEmailChanged() {
    if (this.newEmail === this.email) this.$v.newEmail.$reset()
  }

  async updateData() {
    this.loadUpdate = true

    const success =
      this.selectedRadio === 'password'
        ? await this.updatePassword()
        : await this.updateEmail()

    if (!success) this.oldPassword = ''
    else this.resetData()
    this.loadUpdate = false
  }

  verifyEmail() {
    UserModule.VerifyEmail()
  }

  updateEmail() {
    return UserModule.UpdateEmail({
      password: this.oldPassword,
      newEmail: this.newEmail
    })
  }

  updatePassword() {
    return UserModule.UpdatePassword({
      old: this.oldPassword,
      new: this.p.newPassword
    })
  }

  resetData() {
    this.newEmail = this.email
    this.p.newPassword = ''
    this.p.confirmPassword = ''
    this.oldPassword = ''
    this.$v.$reset()
  }
}
</script>
