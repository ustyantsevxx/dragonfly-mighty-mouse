<template>
  <b-container v-if="subj">
    <b-row>
      <b-col>
        <h1>
          {{ subj.name }}
        </h1>
      </b-col>
    </b-row>
  </b-container>
  <loader v-else />
</template>

<script>
import Loader from '@/components/Loader'

export default {
  components: { Loader },

  computed: {
    subj() {
      return this.$store.state.teacher.subjects
        ? this.$store.state.teacher.subjects.find(x => x.id === this.$route.params.id)
        : null
    }
  },
  async created() {
    if (this.$store.state.teacher.subjects === null)
      await this.$store.dispatch('fetch')
    if (this.subj) document.title = this.subj.name
  }
}
</script>