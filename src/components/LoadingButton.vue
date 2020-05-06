<template>
  <b-btn v-bind="$attrs" @click="$emit('click')" :disabled="load">
    <b-spinner v-if="load" small class="align-middle" />
    <slot v-else />
  </b-btn>
</template>

<script>
export default {
  props: {
    load: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  transition: opacity 0.5s;
}
</style>
