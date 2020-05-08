<template>
  <b-btn
    v-bind="$attrs"
    class="position-relative"
    @click="$emit('click')"
    :disabled="load"
  >
    <b-overlay
      :show="load"
      no-wrap
      class="disabled"
      spinner-small
      spinner-variant="dark"
    />
    <slot />
  </b-btn>
</template>

<script>
export default {
  props: {
    load: {
      type: Boolean,
      required: true,
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
