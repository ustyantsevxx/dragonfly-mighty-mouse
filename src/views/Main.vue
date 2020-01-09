<template>
  <iframe
    v-if="signed"
    src="https://www.youtube.com/embed/TNHsw8TLf6Y?controls=0&autoplay=1"
    frameborder="0"
    allow="autoplay"
  />
  <div v-else>войдите для просмотра танца рикардо милоса</div>
</template>

<script>
export default {
  computed: {
    signed() { return this.$store.getters.signed }
  }
}
</script>

<style scoped>
iframe {
  background: black;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>