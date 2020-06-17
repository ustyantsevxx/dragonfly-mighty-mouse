<template>
  <div>
    <navbar class="mb-3" />
    <toasts />
    <transition name="global-fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Navbar from './components/Navbar.vue'
import Toasts from './components/Toasts.vue'

@Component({ components: { Navbar, Toasts } })
export default class App extends Vue {}
</script>
