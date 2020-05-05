<template>
  <b-btn
    v-bind="$attrs"
    :class="btnClass"
    @click="$emit('click')"
    :disabled="loadingView === load || $attrs.disabled"
  >
    <b-spinner v-if="loadingView === load" small class="align-middle" />
    <template v-else>
      <slot>{{ or }}</slot>
    </template>
  </b-btn>
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
    },
    btnClass: {
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
