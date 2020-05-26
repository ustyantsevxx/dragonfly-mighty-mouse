<template>
  <main>
    <b-container v-if="subj && groups && tasks">
      <b-link class="text-decoration-none d-block mb-3" to="/subjects">
        <b-icon icon="arrow-left"></b-icon>
        Назад к списку
      </b-link>

      <b-card class="shadow-sm border-0">
        <b-row>
          <b-col>
            <h1 class="app__subject_name">
              <div
                v-if="isTeacher"
                title="Редактировать дисциплину"
                class="g__pointer"
                @click="openSubjectModal()"
              >
                <span class="text-nowrap mr-1">{{ subj.name }}</span>
                <b-icon icon="pencil" class="g__hover_icon" />
              </div>
              <template v-else>{{ subj.name }}</template>
            </h1>
          </b-col>
        </b-row>

        <b-row>
          <b-col class="app__badges mt-2 d-flex flex-wrap">
            <div class="mr-2 mb-2">
              <b-badge class="app__badge" variant="info">
                {{ subj.course }} курс
              </b-badge>
            </div>
            <div class="text-nowrap mr-2 mb-2">
              <template v-if="tasks">
                <b-badge
                  variant="success"
                  class="app__badge"
                  :class="{
                    app__border_radius_right_0:
                      visibleTasksCount !== tasks.length
                  }"
                >
                  {{ num2str(tasks.length, taskForms) }}
                </b-badge>
                <b-badge
                  variant="danger"
                  class="app__badge app__border_radius_left_0"
                  v-if="isTeacher && visibleTasksCount != tasks.length"
                >
                  {{ visibleTasksCount }} доступно
                </b-badge>
              </template>
            </div>
            <div>
              <b-badge class="app__badge" v-if="groups && isTeacher">
                {{ num2str(groups.length, ['группа', 'группы', 'групп']) }}
              </b-badge>
            </div>
          </b-col>
        </b-row>
      </b-card>

      <b-nav fill pills class="my-3 shadow-sm">
        <b-nav-item
          link-classes="app__link app__border_radius_right_0"
          exact-active-class="app__link_active"
          to="tasks"
        >
          Лабораторные работы
        </b-nav-item>
        <b-nav-item
          link-classes="app__link app__border_radius_left_0"
          exact-active-class="app__link_active"
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
import { num2str } from '@/assets/js/functions'
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
    subj: {
      handler() {
        if (this.subj) this.changeTitle()
      },
      immediate: true
    }
  },

  beforeCreate() {
    let id = this.$route.params.id
    this.$store.dispatch(BIND_GROUPS, id)
    this.$store.dispatch(BIND_MARKS, { subjectId: id, force: false })
    this.$store.dispatch(BIND_TASKS, id)
    this.$store.commit('setBoundSubjectId', id)
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
.app__subject_name {
  width: max-content;
  margin-bottom: 0;

  &:hover {
    .g__hover_icon {
      opacity: 0.1;
    }
  }
}

.app__link_active {
  transition: background-color 0.17s ease-in-out;
  background: $dark !important;
  color: white !important;
}

.app__link {
  color: black;
  transition: background-color 0.17s ease-in-out;
  border-radius: 0.25rem;
  background-color: white;

  &:hover {
    color: black;
    background-color: darken($light, 3);
  }
}

.app__badges {
  .app__badge {
    font-size: 1rem;
  }
}

.app__border_radius_right_0 {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.app__border_radius_left_0 {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
</style>
