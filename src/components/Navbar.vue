<template>
  <b-navbar toggleable="sm" type="dark" variant="dark" :sticky="true">
    <b-navbar-brand to="/">Project Scimitar</b-navbar-brand>

    <b-navbar-toggle target="collapse" />

    <b-collapse id="collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <template v-if="!signed">
          <b-nav-item to="/login">Войти</b-nav-item>
          <b-nav-item to="/register">Регистрация</b-nav-item>
        </template>
        <template v-else>
          <b-nav-item to="/account">{{`${name} ${surname}`}}</b-nav-item>
          <b-nav-item @click="signOut">Выйти</b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  computed: {
    name() {
      return this.$store.getters.name
    },
    surname() {
      return this.$store.getters.surname
    },
    signed() {
      return this.$store.getters.signed
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch('signOut')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>