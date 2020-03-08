<template>
  <b-container v-if="info">
    <b-row>
      <b-col>
        <b-jumbotron>
          <template #header>Приглашение в группу</template>
          <template #lead>
            <div>{{info.teacherName}} приглашает вас присоединиться к группе "{{info.groupName}}"</div>
            <div>Дисциплина "{{info.subject.name}}", {{info.subject.course}} курс</div>
          </template>
          <hr class="my-3" />
          <p>
            Вступив, вы сможете смотреть ведомость всей группы,
            а также видеть список доступных лабораторных работ по дисциплине.
          </p>
          <b-button variant="success" @click="join">Присоединиться</b-button>
        </b-jumbotron>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data: () => ({
    info: null
  }),
  async beforeCreate() {
    let a = await this.$store.dispatch('groupInfo', this.$route.params.id)
    this.info = a
  },
  methods: {
    join() {
      this.$store.dispatch('joinGroup', this.$route.params.id)
    }
  }
}
</script>