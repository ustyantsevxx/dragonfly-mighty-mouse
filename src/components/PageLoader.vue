<template>
  <div class="app__container" v-if="active">
    <b-spinner />
  </div>
</template>

<script>
export default {
  props: {
    active: {
      default: true,
      type: Boolean
    }
  }
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
