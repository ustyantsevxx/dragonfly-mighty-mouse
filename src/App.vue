<template>
  <div id="app">
    <app-layout />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppLayout from '@/layout/index.vue'
import { SubjectsModule } from './store/modules/subjects'
import { UserModule } from './store/modules/user'

@Component({ components: { AppLayout } })
export default class extends Vue {
  async beforeCreate() {
    if (UserModule.signed) await SubjectsModule.BindSubjects()
  }
}
</script>
