<template>
  <div>
    <b-btn
      v-bind="$attrs"
      @click="$emit('click')"
      :disabled="loadingView === load || $attrs.disabled"
    >
      <b-spinner v-if="loadingView === load" small class="align-middle" />
      <template v-else>{{ or }}</template>
    </b-btn>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    load: String,
    or: String
  },

  computed: {
    loadingView() { return this.$store.state.loadingView }
  }
}
</script>

<style scoped>
button {
  transition: opacity 0.5s;
}
</style>