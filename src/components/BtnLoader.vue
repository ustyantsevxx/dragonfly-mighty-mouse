<template>
  <div>
    <b-button
      v-bind="$attrs"
      @click="$emit('click')"
      :disabled="loadingView === load || $attrs.disabled"
      :loading="loadingView === load"
    >
      <slot>{{ or }}</slot>
    </b-button>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    load: {
      type: String,
      required: true
    },
    or: {
      type: String,
      default: ''
    }
  },

  computed: {
    loadingView() {
      return this.$store.state.loadingView
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  transition: opacity 0.5s;
}
</style>
