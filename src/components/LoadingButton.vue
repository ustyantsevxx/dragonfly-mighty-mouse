<template>
  <b-btn
    v-bind="$attrs"
    class="position-relative"
    @click="$emit('click')"
    :disabled="load || displayCheck"
  >
    <b-overlay :show="load || displayCheck" no-wrap class="disabled">
      <template #overlay>
        <b-spinner v-if="load" small variant="dark" />
        <template v-else-if="!load && displayCheck">
          <b-icon icon="check" class="text-success" scale="1.5" />
        </template>
      </template>
    </b-overlay>
    <slot />
  </b-btn>
</template>

<script>
export default {
  data: () => ({
    displayCheck: false
  }),
  props: {
    load: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  watch: {
    load(value) {
      if (!value) {
        this.displayCheck = true
        setTimeout(() => (this.displayCheck = false), 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  transition: opacity 0.5s;
}
</style>
