<template>
  <b-btn
    v-bind="$attrs"
    class="position-relative app__btn"
    @click="$emit('click')"
    :disabled="load"
  >
    <b-overlay class="g__disabled" opacity="0" :show="load" no-wrap>
      <template #overlay>
        <b-spinner
          class="mt-1 app__spinner"
          :variant="$attrs.variant || 'light'"
          :small="!$attrs.size"
        />
      </template>
    </b-overlay>
    <div class="app__slot_content" :class="{ app__transparent: load }">
      <slot />
    </div>
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
.app__btn {
  transition: opacity 0.5s;
}

.app__slot_content {
  transition: opacity 0.1s;
}

.app__spinner {
  filter: invert(100%) saturate(0) brightness(200%);
}

.app__transparent {
  opacity: 0;
}
</style>
