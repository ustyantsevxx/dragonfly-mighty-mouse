<template>
  <div class="mb-5">
    <b-row>
      <b-col>
        <b-list-group class="shadow-sm">
          <template v-if="labListSorted.length">
            <b-list-group-item
              class="app__task_item border-0"
              v-for="(task, i) in labListSorted"
              :key="i"
            >
              <header
                v-b-toggle="`acc-${i}`"
                class="app__task_header"
                :class="{ app__hidden_task: !task.visible }"
              >
                <b class="app__task_number mr-1">{{ task.number }}.</b>
                <span class="app__task_name g__text_overflow">
                  {{ task.name }}
                </span>
                <span
                  class="app__task_description g__text_overflow d-none d-sm-block"
                >
                  {{ taskDescriptionMapped(task.description) }}
                </span>
                <b-badge class="app__score_badge" variant="primary" pill>
                  {{ form(task.score, wordForms) }}
                </b-badge>
                <b-icon
                  v-if="isTeacher"
                  :icon="task.visible ? 'eye-fill' : 'eye-slash-fill'"
                  :variant="task.visible ? 'success' : 'danger'"
                  class="app__visibility_icon ml-2"
                  scale="1.5"
                />
                <b-icon icon="arrow-bar-up" class="app__collapse_icon" />
              </header>
              <b-collapse :id="`acc-${i}`" accordion="tasks">
                <div class="app__collapse_content">
                  <section>
                    <h3>
                      Лабораторная работа №{{ task.number }} &mdash;
                      <b>{{ task.name }}</b>
                    </h3>
                    <p class="mt-3">
                      <wysiwyg-editor
                        :editable="false"
                        :content="task.description"
                      />
                    </p>
                    <b>Награда</b>
                    <p>{{ form(task.score, wordForms) }}</p>
                    <template v-if="task.files && task.files.length">
                      <b>Прикрепленные файлы</b>
                      <b-card-group columns class="mt-2">
                        <b-card
                          v-for="(file, j) in task.files"
                          @click="downloadFile(file.link)"
                          :key="j"
                          class="app__file"
                        >
                          <span
                            :class="getClass(file.name)"
                            class="app__file_icon mr-3"
                          ></span>
                          <span>{{ file.name }}</span>
                        </b-card>
                      </b-card-group>
                    </template>
                  </section>
                  <footer
                    v-if="isTeacher"
                    class="d-flex justify-content-end align-items-center"
                  >
                    <b-form-checkbox
                      class="mr-3"
                      switch
                      v-model="task.visible"
                      @change="toggleTaskVisibility(task.id, $event)"
                    >
                      <span :class="{ 'text-danger': !task.visible }">
                        {{ task.visible ? 'Открыта' : 'Закрыта' }}
                      </span>
                    </b-form-checkbox>
                    <b-btn variant="outline-dark" @click="openModal(i)">
                      Редактировать
                    </b-btn>
                  </footer>
                </div>
              </b-collapse>
            </b-list-group-item>
          </template>
          <template v-else>
            <b-card-text
              class="app__empty_msg text-center text-muted py-4 mb-0"
            >
              Список лабораторных работ пуст.
            </b-card-text>
          </template>
          <b-list-group-item
            @click="openModal(null)"
            v-if="isTeacher"
            class="app__add_task_icon text-center py-1 border-0"
          >
            <div>
              <b-icon icon="plus" scale="1.6" />
              <span class="ml-2">Создать работу</span>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>

    <!-- invisible -->
    <task-modal :task="taskToEdit" id="task-modal" />
    <!-- /invisible !-->
  </div>
</template>

<script>
import TaskModal from '@/components/TaskModal'
import { num2str } from '@/assets/functions'
import icons from 'file-icons-js'
import WysiwygEditor from '@/components/WysiwygEditor'
import { TOGGLE_TASK_VISIBILITY } from '@/store/actions.type'

export default {
  components: { TaskModal, WysiwygEditor },

  data: () => ({
    taskToEdit: null,
    wordForms: ['балл', 'балла', 'баллов']
  }),

  computed: {
    labListSorted() {
      return this.$store.state.tasks
        ? [...this.$store.state.tasks].sort((a, b) => a.number - b.number)
        : []
    },
    isTeacher() {
      return this.$store.state.user.isTeacher
    },
    taskDescriptionMapped() {
      return descr => {
        let result = ''
        let iter = o => {
          let temp = ''
          if (o.content) {
            o.content.forEach(item => {
              if (item.text) temp += item.text
              iter(item)
            })
          }
          result += temp + ' '
        }
        iter(descr)
        return result
      }
    }
  },

  methods: {
    openModal(index) {
      this.taskToEdit = index !== null ? this.labListSorted[index] : null
      this.$nextTick(() => {
        this.$bvModal.show('task-modal')
      })
    },
    toggleTaskVisibility(id, state) {
      this.$store.dispatch(TOGGLE_TASK_VISIBILITY, { id, state })
    },
    getClass: name => icons.getClassWithColor(name),
    downloadFile: link => location.assign(link),
    form: (n, forms) => num2str(n, forms)
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .app__empty_msg {
    background: white !important;
  }

  .app__add_task_icon {
    cursor: pointer;
    border-top: none;
    transition: color 0.3s, background-color 0.3s;

    &:hover {
      color: $primary;
      background-color: $light;
    }
  }

  .app__hidden_task {
    background-color: darken($light, 2%) !important;
  }

  .app__task_item {
    padding: 0;
    transition: background-color 0.17s;

    &:last-of-type {
      .app__task_header {
        border-bottom: none;
      }
    }

    .app__task_header {
      display: flex;
      border-bottom: 1px solid darken($light, 8);
      background-color: darken($light, 5);
      transition: background-color 0.1s ease-in-out;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;

      &:focus {
        outline: none !important;
      }

      .app__task_description {
        margin-left: 1em;
        flex: 1;
        color: transparentize($secondary, 0.3) !important;
      }

      .app__score_badge {
        margin-left: auto;
      }

      .app__collapse_icon {
        display: block;
        font-size: 1.4rem;
        color: $secondary;
        position: absolute;
        z-index: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .app__task_number,
      .app__task_name,
      .app__task_description,
      .app__score_badge,
      .app__visibility_icon {
        opacity: 0.1;
        transition: opacity 0.2s;
      }
    }

    .collapsed {
      background-color: inherit;
      opacity: 1;

      &:hover {
        background-color: $light;
      }

      .app__task_number,
      .app__task_name,
      .app__task_description,
      .app__score_badge,
      .app__visibility_icon {
        opacity: 1;
      }

      .app__collapse_icon {
        display: none;
      }
    }

    .app__collapse_content {
      padding: 12px 20px;
      border-bottom: 1px solid darken($light, 8);
    }
  }

  .app__file {
    cursor: pointer;
    background: transparent !important;

    &:hover {
      background-color: $light !important;
    }

    .card-body {
      padding: 0.5em 1em !important;
      display: flex;
      align-items: center;
    }

    .app__file_icon::before {
      font-size: 2em !important;
    }
  }
}
</style>
