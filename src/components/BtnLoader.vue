<template>
  <b-btn v-bind="$attrs" @click="$emit('click')" :disabled="loadingView === load">
    <b-spinner small class="align-middle" v-if="loadingView === load" />
    <template v-else>{{or}}</template>
  </b-btn>
</template>

<script>
export default {
  props: {
    load: String,
    or: String
  },
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