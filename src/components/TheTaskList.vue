<template>
  <div class="mb-5">
    <b-row>
      <b-col>
        <b-list-group class="shadow-sm">
          <template v-if="labListSorted.length">
            <b-list-group-item
              class="lab-item border-0"
              v-for="(task, i) in labListSorted"
              :key="i"
            >
              <header
                v-b-toggle="`acc-${i}`"
                :class="{ hiddenLab: !task.visible }"
              >
                <b class="mr-1">{{ task.number }}.</b>
                <span class="text-nowrap">{{ task.name }}</span>
                <span class="description overflow">
                  {{ taskDescriptionMapped(task.description) }}
                </span>
                <b-badge variant="primary" pill>
                  {{ form(task.score, wordForms) }}
                </b-badge>
                <b-icon
                  v-if="isTeacher"
                  :icon="task.visible ? 'eye-fill' : 'eye-slash-fill'"
                  :variant="task.visible ? 'success' : 'danger'"
                  class="icon-vis ml-2"
                  scale="1.5"
                />
                <b-icon icon="arrow-bar-up" class="hider" />
              </header>
              <b-collapse :id="`acc-${i}`" accordion="lab-list">
                <div class="collapse-content">
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
                          class="file"
                        >
                          <span
                            :class="getClass(file.name)"
                            class="mr-3 ficon"
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
            <b-card-text class="empty-message text-center text-muted py-4 mb-0">
              Список лабораторных работ пуст.
            </b-card-text>
          </template>
          <b-list-group-item
            @click="openModal(null)"
            v-if="isTeacher"
            class="adder text-center py-1 border-0"
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
          result += temp
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
  .overflow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .empty-message {
    background: white !important;
  }

  @media screen and (max-width: 1080px) {
    .overflow {
      display: none;
    }
  }

  .content {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0 !important;
  }

  .adder {
    cursor: pointer;
    border-top: none;
    transition: color 0.3s, background-color 0.3s;

    &:hover {
      color: var(--primary);

      background-color: #f8f9fa;
    }
  }

  .lab-item {
    padding: 0;
    transition: background-color 0.17s;

    &:last-of-type {
      header {
        border-bottom: none;
      }
    }

    header {
      display: flex;
      border-bottom: 1px solid #dddddd;
      background-color: #f8f9fa;
      transition: background-color 0.1s ease-in-out;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;

      &:hover {
        background-color: #f8f9fa;
      }

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

  .task-description-p {
    white-space: pre-wrap;
  }

  .hiddenLab {
    background-color: #eeeeee !important;
  }

  .file {
    cursor: pointer;
    background: transparent !important;
    &:hover {
      background-color: #f8f9fa !important;
    }
    .card-body {
      padding: 0.5em 1em !important;
      display: flex;
      align-items: center;
      .ficon::before {
        font-size: 2em !important;
      }
    }
  }
}
</style>
