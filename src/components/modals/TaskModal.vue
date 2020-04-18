<template>
  <b-modal
    centered
    @show="beforeShow"
    v-bind="$attrs"
    size="lg"
    no-close-on-backdrop
    :title="`${task ? 'Измен' : 'Добав'}ить лабораторную работу`"
    @hide="resetData"
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

    <b-form-group label="Постановка задачи (необязательно)">
      <wysiwyg-editor @input="description = $event" :content="description" />
    </b-form-group>

    <b-form-group label="Количество баллов">
      <b-form-input
        type="number"
        :state="inputState($v.score)"
        v-model.number.trim="$v.score.$model"
      />
    </b-form-group>

    <div class="font-weight-bold">Прикрепленные файлы (необязательно)</div>
    <b-list-group class="mt-2 mb-3" v-if="files.length || newFilesToUpload.length">
      <b-list-group-item
        v-for="(f,i) in files.concat(newFilesToUpload)"
        :key="i"
        class="d-flex align-items-center bg-light"
      >
        <span class="overflow">{{f.name}}</span>
        <span class="text-nowrap mx-2 text-muted">{{Math.round(f.size / 1024)}} КБ</span>
        <button class="close ml-auto" @click="fileAction(f)">×</button>
      </b-list-group-item>
    </b-list-group>
    <div v-else class="text-center text-muted py-4">Нет прикрепленных файлов</div>
    <b-file
      ref="file-input"
      multiple
      no-drop
      @input="addFile"
      browse-text="Обзор"
      class="overflow"
      placeholder="Выберите файлы для прикрепления"
    />
    <template v-if="uploadProgress > -1">
      <hr />
      <b-progress :value="uploadProgress" :max="maxForProgressBar" variant="dark" animated></b-progress>
    </template>

    <template #modal-footer>
      <template v-if="task">
        <confirm-btn
          @click="deleteTask"
          variant="outline-danger"
          class="mr-auto"
          text="Удалить лабораторную"
        />
      </template>
      <b-btn @click="resetModal('task-modal')" variant="light">Отмена</b-btn>
      <btn-loader
        @click="okAction"
        load="btn-addLab"
        :or="task ?'Обновить' : 'Добавить'"
        :variant="task ? 'warning' : 'success'"
        :disabled="$v.$invalid"
      />
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import ConfirmBtn from '@/components/ConfirmationButton'
import modalMixin from '@/mixins/base'
import WysiwygEditor from '@/components/WysiwygEditor'

export default {
  components: { BtnLoader, WysiwygEditor, ConfirmBtn },

  props: ['task'],

  mixins: [
    modalMixin({
      number: null,
      name: null,
      description: null,
      score: null,
      files: [],
      newFilesToUpload: [],
      oldFilesToDelete: []
    })
  ],

  computed: {
    uploadProgress() {
      return this.$store.state.teacher.filesUploadProgress
    },
    maxForProgressBar() {
      if (!this.task)
        return this.files.length
      else return this.newFilesToUpload.length
    }
  },

  methods: {
    async okAction() {
      this.task ? await this.editTask() : await this.addTask()
      this.resetModal('task-modal')
      this.newFilesToUpload = []
      this.oldFilesToDelete = []
    },
    fileAction(file) {
      if (this.task) {
        if (file instanceof File) {
          this.newFilesToUpload.splice(this.newFilesToUpload.indexOf(file), 1)
        }
        else {
          this.files.splice(this.files.indexOf(file), 1)
          this.oldFilesToDelete.push(file.path)
        }
      }
      else this.files.splice(this.files.indexOf(file), 1)
    },
    beforeShow() {
      if (this.task) {
        this.number = this.task.number
        this.name = this.task.name
        this.description = this.task.description
        this.score = this.task.score
        this.files = [...this.task.files]
      }
      else this.files = []
    },
    async addFile(files) {
      if (!this.task)
        this.files.push(...files)
      else this.newFilesToUpload.push(...files)

      this.$refs['file-input'].reset()
    },
    async addTask() {
      await this.$store.dispatch('addTask', {
        name: this.name,
        score: this.score,
        number: this.number,
        description: this.description,
        files: this.files,
        subjectId: this.$route.params.id,
        visible: false
      })
    },
    async editTask() {
      await this.$store.dispatch('editTask', {
        id: this.task.id,
        name: this.name,
        score: this.score,
        number: this.number,
        description: this.description,
        files: this.files,
        oldFilesToDelete: this.oldFilesToDelete,
        newFilesToUpload: this.newFilesToUpload,
        visible: this.task.visible
      })
    },
    async deleteTask() {
      this.$store.dispatch('deleteTask', this.task.id)
      this.resetModal('task-modal')
    },
  },

  validations: {
    number: { required },
    name: { required },
    description: { required },
    score: { required }
  }
}
</script>