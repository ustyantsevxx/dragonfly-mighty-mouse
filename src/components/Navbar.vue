<template>
  <b-navbar toggleable="sm" type="dark" class="nav shadow-sm nav-on-top px-5" :sticky="true">
    <b-navbar-brand to="/" exact active-class="c">Dragonfly Mighty Mouse</b-navbar-brand>

    <b-navbar-toggle target="collapse" />

    <b-collapse id="collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/subjects" exact>Дисциплины</b-nav-item>
      </b-navbar-nav>
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
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      name: s => s.user.name,
      surname: s => s.user.surname,
      signed: s => s.user.uid
    })
  },

  methods: {
    signOut() {
      if (this.$router.currentRoute.path !== '/')
        this.$router.push('/')
      this.$store.dispatch('signOut')
    }
  }
}
</script>

<style scoped>
.nav {
  background-color: #191414ea;
  border-bottom: 0.3rem solid #ffffff2f;
}

.router-link-active {
  cursor: default;
  color: rgba(255, 255, 255, 0.75) !important;
}
</style>