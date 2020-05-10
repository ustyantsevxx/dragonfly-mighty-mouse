<template>
  <b-btn
    v-bind="$attrs"
    class="position-relative"
    @click="$emit('click')"
    :disabled="load"
  >
    <b-overlay class="disabled" opacity="0" :show="load" no-wrap>
      <template #overlay>
        <b-spinner
          class="mt-1 spinner-spinner"
          :variant="$attrs.variant || 'light'"
          :small="!$attrs.size"
        />
      </template>
    </b-overlay>
    <div class="slot-content" :class="{ transparent: load }"><slot /></div>
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

.slot-content {
  transition: opacity 0.1s;
}

.spinner-spinner {
  filter: invert(100%) saturate(0) brightness(200%);
}

.transparent {
  opacity: 0;
}
</style>
