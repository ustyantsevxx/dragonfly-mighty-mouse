<template>
  <main>
    <b-container v-if="subj && groups && tasks">
      <b-row>
        <b-col>
          <h1 title="Редактировать дисциплину">
            <div v-if="isTeacher" class="pointer" @click="openSubjectModal()">
              <span class="text-nowrap mr-1">{{ subj.name }}</span>
              <b-icon icon="pencil" class="hover-icon" />
            </div>
            <template v-else>{{ subj.name }}</template>
          </h1>
        </b-col>
      </b-row>

      <b-row>
        <b-col class="badges mt-2 d-flex flex-wrap">
          <div class="mr-2 mb-2">
            <b-badge variant="info">{{ subj.course }} курс</b-badge>
          </div>
          <div class="text-nowrap mr-2 mb-2">
            <template v-if="tasks">
              <b-badge
                variant="success"
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
          </div>
          <div>
            <b-badge class="" v-if="groups && isTeacher">
              {{ num2str(groups.length, ['группа', 'группы', 'групп']) }}
            </b-badge>
          </div>
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
      title="Изменение дисциплины"
      ok-title="Обновить"
      cancel-title="Отмена"
    />
    <!-- /invisible -->
  </main>
</template>

<script>
import { num2str } from '@/assets/functions'
import PageLoader from '@/components/PageLoader'
import SubjectModal from '@/components/SubjectModal'
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
    },
    openSubjectModal() {
      this.$bvModal.show('modal-subject')
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  width: max-content;
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
    font-size: 1rem;
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
