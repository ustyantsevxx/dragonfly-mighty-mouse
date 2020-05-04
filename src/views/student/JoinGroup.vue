<template>
  <main>
    <b-container v-if="info && !info.alreadyPresented">
      <b-row>
        <b-col>
          <b-jumbotron>
            <template #header>Приглашение в группу</template>
            <template #lead>
              <div>
                {{ info.teacherName }} приглашает вас присоединиться к группе
                "{{ info.groupName }}"
              </div>
              <div>
                Дисциплина "{{ info.subject.name }}",
                {{ info.subject.course }} курс
              </div>
            </template>
            <hr class="my-3" />
            <template v-if="info.joinable">
              <p>
                Вступив, вы сможете смотреть ведомость всей группы, а также
                видеть список доступных лабораторных работ по дисциплине.
              </p>
              <b-button variant="success" @click="join">
                Присоединиться
              </b-button>
            </template>
            <p v-else class="text-danger font-weight-bold">
              Преподаватель уже закрыл возможность вступления в данную группу.
              Свяжитесь с преподавателем если считаете это ошибкой.
            </p>
          </b-jumbotron>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import { GET_GROUP_INFO, JOIN_GROUP } from '@/store/actions.type'

export default {
  data: () => ({
    info: null
  }),

  async beforeCreate() {
    this.info = await this.$store.dispatch(
      GET_GROUP_INFO,
      this.$route.params.id
    )
    if (!this.info) location.assign(`/`)
    if (this.info.alreadyPresented)
      location.assign(`/subjects/${this.info.subject.id}`)
  },

  methods: {
    async join() {
      await this.$store.dispatch(JOIN_GROUP, this.$route.params.id)
      location.assign(`/subjects/${this.info.subject.id}`)
    }
  }
}
</script>
