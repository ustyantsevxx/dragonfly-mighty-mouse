<template>
  <b-navbar type="is-dark" sticky class="nav">
    <template #brand>
      <b-navbar-item tag="router-link" to="/">
        Dragonfly Mighty Mouse
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="router-link" to="/subjects" exact>
        Дисциплины
      </b-navbar-item>
    </template>
    <template #end>
      <b-navbar-item v-if="!signed" tag="router-link" to="/login">
        Войти
      </b-navbar-item>
      <template v-else>
        <b-navbar-item tag="router-link" to="/account">
          {{ name + ' ' + surname }}
        </b-navbar-item>
        <b-navbar-item @click="signOut">Выйти</b-navbar-item>
      </template>
    </template>
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
      signed: s => s.user.uid
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
.nav {
  background-color: #191414ea;
  border-bottom: 0.3rem solid #ffffff2f;
}

.router-link-active {
  cursor: default;
  color: rgba(255, 255, 255, 0.75) !important;
}
</style>
