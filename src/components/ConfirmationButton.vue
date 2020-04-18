<template>
  <div>
    <transition name="btn-fade" mode="out-in">
      <div v-if="!confirm" :key="1">
        <b-btn v-bind="$attrs" @click="confirm = true">
          <slot>{{ text }}</slot>
        </b-btn>
      </div>
      <div v-else :key="2">
        <b-btn v-bind="$attrs" @click="$emit('click')" variant="dark">
          {{ confirmText }}
        </b-btn>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  data: () => ({ confirm: false }),

  props: {
    confirmText: {
      type: String,
      required: false,
      default: 'Уверены?'
    },
    text: {
      default: '',
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-fade-enter-active,
.btn-fade-leave-active {
  transition: all 0.15s;
}

.btn-fade-enter,
.btn-fade-leave-to {
  opacity: 0;
}
</style>
