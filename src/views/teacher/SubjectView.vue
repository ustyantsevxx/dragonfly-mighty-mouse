<template>
  <main>
    <b-container v-if="subj" fluid class="px-5">
      <b-row>
        <b-col>
          <h1 class="header">
            {{ subj.name }}
            <b-icon
              v-if="isTeacher"
              icon="pencil"
              v-b-modal.modal-subject
              class="hover-icon"
              title="Редактировать"
            />
          </h1>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="badges mt-2">
          <b-badge variant="info" class="mr-2">{{subj.course}} курс</b-badge>
          <template v-if="tasks">
            <b-badge
              variant="success"
              class="mr-0"
              :class="{over: visibleTasksCount !== tasks.length}"
            >{{ num2str(tasks.length, taskForms) }}</b-badge>
            <b-badge
              variant="danger"
              class="over1"
              v-if="isTeacher && visibleTasksCount != tasks.length"
            >{{ visibleTasksCount }} доступно</b-badge>
          </template>
          <b-badge
            variant="dark"
            class="ml-2"
            v-if="groups && isTeacher"
          >{{ num2str(groups.length, ['группа', 'группы' ,'групп']) }}</b-badge>
        </b-col>
      </b-row>

      <hr class="my-4" />

      <task-list />

      <template v-if="isTeacher">
        <hr class="my-4" />
        <group-list v-if="isTeacher" />
      </template>
    </b-container>

    <page-loader v-else />

    <!-- invisible -->
    <subject-modal
      id="modal-subject"
      ref="modal-subject"
      :subject="subj"
      ok-variant="info"
      cancel-variant="light"
      title="Редактирование дисциплины"
      ok-title="Обновить"
      centered
      cancel-title="Отмена"
    />
    <!-- /invisible -->
  </main>
</template>

<script>
import { num2str } from '@/assets/functions'
import TaskList from '@/components/teacher/TaskList'
import GroupList from '@/components/teacher/GroupList'
import PageLoader from '@/components/PageLoader'
import SubjectModal from '@/components/modals/SubjectModal'
import { mapState } from 'vuex'

export default {
  components: { PageLoader, TaskList, GroupList, SubjectModal },
  data: () => ({ taskForms: ['лабораторная', 'лабораторные', 'лабораторных'] }),
  computed: {
    subj() {
      return this.$store.state.teacher.subjects
        ? this.$store.state.teacher.subjects.find(x => x.id === this.$route.params.id)
        : null
    },
    ...mapState({
      tasks: s => s.teacher.tasks,
      isTeacher: s => s.user.isTeacher,
      groups: s => s.teacher.groups
    }),
    visibleTasksCount() {
      return this.tasks.filter(x => x.visible).length
    }
  },
  watch: {
    subj() {
      if (this.subj) document.title = this.subj.name
    }
  },
  mounted() {
    if (this.subj) document.title = this.subj.name
  },
  methods: {
    num2str: (n, forms) => num2str(n, forms)
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 0;
  &:hover {
    .hover-icon {
      opacity: 0.1;
    }
  }
}

.badges {
  span {
    font-size: 1em;
  }
}
.over {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.over1 {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>