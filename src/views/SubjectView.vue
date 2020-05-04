<template>
  <main>
    <b-container v-if="subj && groups && tasks">
      <b-row>
        <b-col>
          <h1>
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
          <b-badge variant="info" class="mr-2">{{ subj.course }} курс</b-badge>
          <template v-if="tasks">
            <b-badge
              variant="success"
              class="mr-0"
              :class="{ over: visibleTasksCount !== tasks.length }"
            >
              {{ num2str(tasks.length, taskForms) }}
            </b-badge>
            <b-badge
              variant="danger"
              class="over1"
              v-if="isTeacher && visibleTasksCount != tasks.length"
            >
              {{ visibleTasksCount }} доступно
            </b-badge>
          </template>
          <b-badge class="ml-2" v-if="groups && isTeacher">
            {{ num2str(groups.length, ['группа', 'группы', 'групп']) }}
          </b-badge>
        </b-col>
      </b-row>

      <hr class="my-4" />

      <b-nav fill pills class="mb-4 tabs-nav">
        <b-nav-item exact-active-class="active link-active" to="tasks">
          Лабораторные работы
        </b-nav-item>
        <b-nav-item
          exact-active-class="active link-active"
          :to="isTeacher ? 'groups' : 'my-group'"
        >
          <template v-if="isTeacher">Группы и баллы</template>
          <template v-else>Ведомость группы</template>
        </b-nav-item>
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
import { BIND_GROUPS, BIND_MARKS, BIND_TASKS } from '@/store/actions.type'

export default {
  components: { PageLoader, SubjectModal },

  data: () => ({
    taskForms: ['лабораторная', 'лабораторные', 'лабораторных']
  }),

  computed: {
    subj() {
      return this.$store.state.subjects
        ? this.$store.state.subjects.find(x => x.id === this.$route.params.id)
        : null
    },
    ...mapState({
      isTeacher: s => s.user.isTeacher,
      tasks: s => s.tasks,
      groups: s => s.groups
    }),
    visibleTasksCount() {
      return this.tasks.filter(x => x.visible).length
    }
  },

  watch: {
    subj() {
      if (this.subj) this.changeTitle()
    }
  },

  beforeCreate() {
    let id = this.$route.params.id
    this.$store.dispatch(BIND_GROUPS, id)
    this.$store.dispatch(BIND_MARKS, id)
    this.$store.dispatch(BIND_TASKS, id)
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
h1 {
  margin-bottom: 0;
  &:hover {
    .hover-icon {
      opacity: 0.1;
    }
  }
}

/deep/ {
  .link-active {
    transition: background-color 0.17s ease-in-out;
    background: var(--dark) !important;
    color: white !important;
  }

  li a {
    color: black;
    transition: background-color 0.17s ease-in-out;
    border-radius: 0.25rem;

    &:hover {
      color: black;
      background-color: #e9ecef;
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
