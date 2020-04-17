<template>
  <main>
    <b-container v-if="subj && groups && tasks">
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

      <b-nav fill pills class="mb-4 tabs-nav">
        <b-nav-item exact-active-class="active link-active" to="tasks">Лабораторные работы</b-nav-item>
        <b-nav-item exact-active-class="active link-active" to="groups">Группы и баллы</b-nav-item>
      </b-nav>

      <transition name="global-fade" mode="out-in">
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
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
import PageLoader from '@/components/PageLoader'
import SubjectModal from '@/components/modals/SubjectModal'
import { mapState } from 'vuex'

export default {
  components: { PageLoader, SubjectModal },

  data: () => ({
    taskForms: ['лабораторная', 'лабораторные', 'лабораторных']
  }),

  computed: {
    subj() {
      return this.$store.state.teacher.subjects
        ? this.$store.state.teacher.subjects.find(x => x.id === this.$route.params.id)
        : null
    },
    ...mapState({
      isTeacher: s => s.user.isTeacher,
      tasks: s => s.teacher.tasks,
      groups: s => s.teacher.groups
    }),
    visibleTasksCount() {
      return this.tasks.filter(x => x.visible).length
    }
  },

  watch: {
    subj() { if (this.subj) this.changeTitle() }
  },

  beforeCreate() {
    let id = this.$route.params.id
    this.$store.dispatch('bindGroup', id)
    this.$store.dispatch('bindMarks', id)
    this.$store.dispatch('bindTasks', id)
  },

  mounted() {
    if (this.subj) this.changeTitle()
  },

  methods: {
    num2str: (n, forms) => num2str(n, forms),
    changeTitle() {
      if (this.$route.path.includes('tasks'))
        document.title = `Лабораторные | ${this.subj.name}`
      else if (this.$route.path.includes('groups'))
        document.title = `Группы и баллы | ${this.subj.name}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import "bootstrap/scss/bootstrap";
.header {
  margin-bottom: 0;
  &:hover {
    .hover-icon {
      opacity: 0.1;
    }
  }
}

@media screen and (max-width: 1080px) {
  .header {
    font-size: 1.5rem;
  }
}

/deep/ {
  .link-active {
    transition: background-color 0.17s ease-in-out;

    background: $dark !important;
    color: $white !important;
  }

  li a {
    transition: background-color 0.17s ease-in-out;
    border-radius: 0.25rem;

    &:hover {
      color: black;
      background-color: #e9ecef;
    }

    color: black;
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