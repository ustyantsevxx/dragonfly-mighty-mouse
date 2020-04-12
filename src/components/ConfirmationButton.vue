<template>
  <div>
    <b-btn v-if="!confirm" v-bind="$attrs" @click="confirm = true">
      <slot>{{text}}</slot>
    </b-btn>
    <b-btn v-else v-bind="$attrs" @click="$emit('click')" variant="dark">{{confirmText}}</b-btn>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  data: () => ({ confirm: false }),

  props: {
    'confirm-text': {
      type: String,
      required: false,
      default: 'Уверены?'
    },
    'text': {
      type: String,
      required: false
    }
  }
}
</script>