<template>
  <b-navbar toggleable="sm" type="dark" class="app__navbar shadow-sm" sticky>
    <b-navbar-brand to="/" exact active-class="c">
      Dragonfly.vue
    </b-navbar-brand>
    <b-navbar-toggle target="collapse" />
    <b-collapse id="collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/subjects" exact>Дисциплины</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="!signed" to="/login">Войти</b-nav-item>
        <template v-else>
          <b-nav-item to="/account">{{ name + ' ' + surname }}</b-nav-item>
          <b-nav-item @click="signOut">Выйти</b-nav-item>
        </template>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'
import { LOGOUT } from '@/store/actions.type'

export default {
  computed: {
    ...mapState({
      name: s => s.user.name,
      surname: s => s.user.surname,
      signed: s => s.user.uid,
      isTeacher: s => s.user.isTeacher
    })
  },
  methods: {
    signOut() {
      if (this.$router.currentRoute.path !== '/') this.$router.push('/')
      this.$store.dispatch(LOGOUT)
    }
  }
}
</script>

<style lang="scss" scoped>
.app__navbar {
  background-color: #191414ea;
  border-bottom: 0.3rem solid #ffffff2f;
}

.router-link-active {
  cursor: default;
  color: darken($light, 15) !important;
}
</style>
