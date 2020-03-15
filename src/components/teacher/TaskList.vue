<template>
  <div>
    <b-row>
      <b-col class="d-flex justify-content-between">
        <h4 class="m-0 text-muted">Лабораторные работы</h4>
        <b-link v-if="isTeacher" v-b-modal.add-lab-modal size="sm" variant="dark">Создать</b-link>
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
                  <p>{{task.description}}</p>
                  <b>Награда</b>
                  <p>{{form(task.score, wordForms)}}</p>
                  <template v-if="task.files && task.files.length">
                    <b>Прикрепленные файлы</b>
                    <div v-for="(file,i) in task.files" :key="i">
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
                  <b-btn size="sm" variant="secondary" @click="editTaskModal(i)">Редактировать</b-btn>
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
    <b-modal
      centered
      no-close-on-backdrop
      :title=" `${editTaskIndex === null ? 'Добавить' : 'Изменить'} лабораторную работу`"
      id="add-lab-modal"
      ref="add-lab-modal"
      @hide="resetModal('add-lab-modal'); editTaskIndex = null"
    >
      <b-form-group label="Номер работы">
        <b-form-input
          type="number"
          min="1"
          :state="inputState($v.number)"
          v-model.number.trim="$v.number.$model"
        />
      </b-form-group>

      <b-form-group label="Название">
        <b-form-input :state="inputState($v.name)" v-model.trim="$v.name.$model" />
      </b-form-group>

      <b-form-group label="Описание">
        <b-form-textarea :state="inputState($v.description)" v-model.trim="$v.description.$model" />
      </b-form-group>

      <b-form-group label="Количество баллов">
        <b-form-input
          type="number"
          :state="inputState($v.score)"
          v-model.number.trim="$v.score.$model"
        />
      </b-form-group>

      <div>Прикрепленные файлы</div>
      <hr />
      <b-list-group v-if="files.length">
        <b-list-group-item v-for="(f,i) in files" :key="i" class="d-flex align-items-center">
          <span class="overflow">{{f.name}}</span>
          <span class="text-nowrap mx-2 text-muted">{{Math.round(f.size / 1024)}} КБ</span>
          <button class="close ml-auto" @click="files.splice(i,1)">×</button>
        </b-list-group-item>
      </b-list-group>
      <div v-else class="text-center text-muted">Нет прикрепленных файлов</div>
      <hr />
      <b-file
        ref="file-input"
        multiple
        @input="addFile"
        browse-text="Обзор"
        class="overflow"
        drop-placeholder="Отпустите"
        placeholder="Выберите файл(-ы) или перетащите сюда"
      />
      <template v-if="editTaskIndex !== null">
        <hr />
        <b-btn variant="danger" @click="deleteTask()" block>Удалить лабораторную</b-btn>
      </template>

      <template #modal-footer>
        <b-btn @click="resetModal('add-lab-modal')" variant="light">Отмена</b-btn>
        <btn-loader
          @click="taskAction"
          load="btn-addLab"
          :or="editTaskIndex === null ? 'Добавить' : 'Обновить'"
          :variant="editTaskIndex === null ? 'success' : 'warning'"
          :disabled="$v.$invalid"
        />
      </template>
    </b-modal>
    <!-- /invisible !-->
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import baseMixin from '@/mixins/base'
import { num2str } from '@/assets/functions'

export default {
  components: { BtnLoader },
  mixins: [
    baseMixin({
      number: null,
      name: null,
      description: null,
      score: null,
      files: [],
      wordForms: ['балл', 'балла', 'баллов'],
      editTaskIndex: null
    })
  ],
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
    taskAction() {
      this.editTaskIndex === null ? this.addTask() : this.editTask()
    },
    editTaskModal(i) {
      this.editTaskIndex = i
      this.number = this.labListSorted[i].number
      this.name = this.labListSorted[i].name
      this.description = this.labListSorted[i].description
      this.score = this.labListSorted[i].score
      this.files = [...this.labListSorted[i].files]
      this.$refs['add-lab-modal'].show()
    },
    async addFile(files) {
      this.files.push(...files)
      this.$refs['file-input'].reset()
    },
    async addTask() {
      await this.$store.dispatch('addTask', {
        name: this.name,
        score: this.score,
        number: this.number,
        description: this.description,
        files: this.files,
        subjectId: this.$parent.subj.id,
        visible: false
      })
      this.resetModal('add-lab-modal')
    },
    async editTask() {
      await this.$store.dispatch('editTask', {
        id: this.labListSorted[this.editTaskIndex].id,
        name: this.name,
        score: this.score,
        number: this.number,
        description: this.description,
        files: this.files,
        visible: this.labListSorted[this.editTaskIndex].visible
      })
      this.resetModal('add-lab-modal')
    },
    deleteTask() {
      this.$store.dispatch('deleteTask', this.labListSorted[this.editTaskIndex].id)
      this.resetModal('add-lab-modal')
    },
    toggleTaskVisibility(id, e) {
      this.$store.dispatch('toggleTaskVisibility', { id, state: e })
    },
    form: (n, forms) => num2str(n, forms)
  },
  validations: {
    number: { required },
    name: { required },
    description: { required },
    score: { required }
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

p {
  white-space: pre;
}

.hiddenLab {
  background-color: #eeeeee !important;
}
</style>