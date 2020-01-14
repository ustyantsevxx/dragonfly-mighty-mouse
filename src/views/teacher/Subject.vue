<template>
  <div>{{ subj }}</div>
</template>

<script>
export default {
  computed: {
    subj() {
      return this.$store.state.teacher.subjects
        ? this.$store.state.teacher.subjects.find(x => x.id === this.$route.params.id)
        : null
    }
  },
  beforeCreate() {
    if (this.$store.state.teacher.subjects === null)
      this.$store.dispatch('fetch')
    document.title = this.subj.name
  }
}
</script>