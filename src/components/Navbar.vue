<template>
  <b-navbar toggleable="sm" type="dark" class="nav" :sticky="true">
    <b-navbar-brand to="/" exact active-class="c"
      >Project Scimitar</b-navbar-brand
    >

    <b-navbar-toggle target="collapse" />

    <b-collapse id="collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="!signed" to="/login">Войти</b-nav-item>
        <template v-else>
          <b-nav-item to="/account">{{ name + " " + surname }}</b-nav-item>
          <b-nav-item @click="signOut">Выйти</b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: { ...mapGetters(['name', 'surname', 'signed']) },

  methods: {
    async signOut() {
      await this.$store.dispatch('signOut')
      if (this.$router.currentRoute.path !== '/')
        this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.nav {
  background-color: #191414ea;
}

.router-link-active {
  cursor: default;
  color: rgba(255, 255, 255, 0.75) !important;
}
</style>