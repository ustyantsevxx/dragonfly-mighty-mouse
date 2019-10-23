<template>
  <b-card class="p-3">
    <h1>Смена пароля</h1>
    <hr />
    <b-form>
      <b-form-group label="Старый пароль" label-for="old-pass-field">
        <b-form-input type="password" id="old-pass-field" required v-model="oldPassword" />
      </b-form-group>

      <b-form-group label="Новый пароль" label-for="new-pass-field">
        <b-form-input type="password" id="new-pass-field" required v-model="newPassword" />
      </b-form-group>

      <b-form-group label="Новый пароль еще раз" label-for="confirm-new-pass-field">
        <b-form-input type="password" id="confirm-new-pass-field" required />
      </b-form-group>

      <b-btn variant="info" block @click="updatePassword">Сохранить</b-btn>
    </b-form>
  </b-card>
</template>

<script>
export default {
  data() {
    return {
      oldPassword: null,
      newPassword: null
    }
  },
  methods: {
    updatePassword() {
      this.$store.dispatch('updatePassword', { old: this.oldPassword, new: this.newPassword })
    },
  }
}
</script>

<style>
</style>