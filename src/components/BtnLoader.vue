<template>
  <div>
    <b-btn
      v-bind="$attrs"
      @click="$emit('click')"
      :disabled="loadingView === load || $attrs.disabled"
    >
      <b-spinner small class="align-middle" v-if="loadingView === load" />
      <template v-else>{{or}}</template>
    </b-btn>
  </div>
</template>

<script>
export default {
  props: {
    load: String,
    or: String
  },
  inheritAttrs: false,
  computed: {
    loadingView() {
      return this.$store.getters.loadingView
    }
  }
}
</script>

<style scoped>
button {
  transition: opacity 0.5s;
}

button:disabled {
  cursor: not-allowed;
}
</style>