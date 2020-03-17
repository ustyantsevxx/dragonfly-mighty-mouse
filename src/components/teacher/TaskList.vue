<template>
  <div>
    <b-row>
      <b-col class="d-flex justify-content-between">
        <h4 class="m-0 text-muted">Лабораторные работы</h4>
        <b-link v-if="isTeacher" @click="openModal(null)" size="sm" variant="dark">Создать</b-link>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <b-list-group v-if="labListSorted.length">
          <b-list-group-item class="lab-item" v-for="(task, i) in labListSorted" :key="i">
            <header v-b-toggle="`acc-${i}`" :class="{hiddenLab: !task.visible}">
              <b class="mr-1">{{task.number}}.</b>
              <span class="text-nowrap">{{task.name}}</span>
              <span class="description overflow">{{task.description}}</span>
              <b-badge variant="primary" pill>{{form(task.score, wordForms)}}</b-badge>
              <b-icon
                v-if="isTeacher"
                :icon="task.visible ? 'eye-fill' :  'eye-slash-fill'"
                :variant="task.visible ? 'success' :  'danger'"
                class="icon-vis ml-2"
                scale="1.5"
              ></b-icon>
              <b-icon icon="arrow-bar-up" class="hider" />
            </header>
            <b-collapse :class="{hiddenLab: !task.visible}" :id="`acc-${i}`" accordion="lab-list">
              <div class="collapse-content">
                <section>
                  <b>Лабораторная работа №{{task.number}}</b>
                  <p>{{task.name}}</p>
                  <b>Описание</b>
                  <p class="task-description-p">{{task.description}}</p>
                  <b>Награда</b>
                  <p>{{form(task.score, wordForms)}}</p>
                  <template v-if="task.files && task.files.length">
                    <b>Прикрепленные файлы</b>
                    <div v-for="(file,j) in task.files" :key="j">
                      <b-link :href="file.link">{{file.name}}</b-link>
                    </div>
                  </template>
                </section>
                <footer v-if="isTeacher" class="d-flex justify-content-end align-items-center">
                  <b-form-checkbox
                    class="mr-3"
                    switch
                    size="sm"
                    v-model="task.visible"
                    @change="toggleTaskVisibility(task.id, $event)"
                  >{{task.visible ? 'Открыта' : 'Закрыта' }}</b-form-checkbox>
                  <b-btn size="sm" variant="secondary" @click="openModal(i)">Редактировать</b-btn>
                </footer>
              </div>
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
        <b-card v-else>
          <b-card-text class="text-center text-muted py-4">Список лабораторных работ пуст.</b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <!-- invisible -->
    <task-modal :task="taskToEdit" id="task-modal" />
    <!-- /invisible !-->
  </div>
</template>

<script>
import TaskModal from '@/components/modals/TaskModal'
import { num2str } from '@/assets/functions'

export default {
  components: { TaskModal },
  data: () => ({
    taskToEdit: null,
    wordForms: ['балл', 'балла', 'баллов']
  }),
  computed: {
    labListSorted() {
      return this.$store.state.teacher.tasks
        ? [...this.$store.state.teacher.tasks].sort((a, b) => a.number - b.number)
        : []
    },
    isTeacher() {
      return this.$store.state.user.isTeacher
    }
  },
  beforeCreate() {
    this.$store.dispatch('bindTasks', this.$parent.subj.id)
  },
  methods: {
    openModal(index) {
      this.taskToEdit = index !== null ? this.labListSorted[index] : null
      this.$nextTick(() => {
        this.$bvModal.show('task-modal')
      })
    },
    toggleTaskVisibility(id, e) {
      this.$store.dispatch('toggleTaskVisibility', { id, state: e })
    },
    form: (n, forms) => num2str(n, forms)
  }
}
</script>

<style lang="scss">
.overflow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.lab-item {
  padding: 0;
  transition: background-color 0.17s;

  header {
    display: flex;
    background-color: #f8f9fa;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;

    .description {
      margin-left: 1em;
      color: #6c757d9d !important;
    }

    .badge {
      margin-left: auto;
    }

    .hider {
      display: block;
      font-size: 1.4rem;
      color: #6c757d9d;
      position: absolute;
      z-index: 0;
      left: 50%;
      transform: translateX(-50%);
    }

    b,
    span,
    .description,
    .badge,
    .icon-vis {
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      background-color: #f8f9fa;
    }
  }

  .collapsed {
    background-color: inherit;

    b,
    span,
    .description,
    .badge,
    .icon-vis {
      opacity: 1;
    }

    .hider {
      display: none;
    }
  }

  .collapse-content {
    padding: 12px 20px;
  }
}

.add-item-cont {
  padding: 0.1em;
  background-color: #f8f9fa;

  .add-item {
    justify-content: center;
    align-items: center;

    .bi {
      height: 2em;
      width: 2em;
    }
  }
}
.task-description-p {
  white-space: pre-wrap;
}

.hiddenLab {
  background-color: #eeeeee !important;
}
</style>