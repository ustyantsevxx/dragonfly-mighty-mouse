<template>
  <b-btn
    :disabled="load || $attrs.disabled"
    v-bind="$attrs"
    class="position-relative app__btn"
    @click="$emit('click')"
  >
    <b-overlay class="g__disabled" opacity="0" :show="load" no-wrap>
      <template #overlay>
        <b-spinner
          class="mt-1"
          :class="`app__spinner_${$attrs.variant || 'light'}`"
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

@each $color, $value in $theme-colors {
  .app__spinner_#{$color} {
    border-color: color-yiq($value);
    border-right-color: transparent;
  }
}

.app__transparent {
  opacity: 0;
}
</style>
