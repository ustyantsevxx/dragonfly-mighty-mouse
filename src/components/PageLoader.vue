<template>
  <div class="app__container" v-if="active">
    <b-spinner />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop({ default: true }) active?: boolean
}
</script>

<style lang="scss" scoped>
.app__container {
  z-index: 1000;
  width: 100%;
  text-align: center;
}

.spinner-border {
  width: 77px;
  height: 77px;
  border-width: 7px;
}
</style>
