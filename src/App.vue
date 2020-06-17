<template>
  <div id="app">
    <app-layout />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppLayout from '@/layout/index.vue'

@Component({ components: { AppLayout } })
export default class extends Vue {}
</script>
