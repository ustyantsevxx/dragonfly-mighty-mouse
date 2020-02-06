<template>
  <b-container v-if="subj">
    <b-row class="editable">
      <b-col>
        <h1 class="header">
          {{ subj.name }}
          <b-icon
            icon="pencil"
            @click="openModalWithEditData"
            class="edit-icon"
            title="Редактировать"
          />
        </h1>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-badge variant="info">{{subj.course}} курс</b-badge>
      </b-col>
    </b-row>

    <b-row align-h="center">
      <b-col>
        <hr />
      </b-col>
    </b-row>

    <task-list />

    <b-modal centered title="Редактирование дисциплины" ref="edit-form">
      <b-form-group label="Название" label-for="name-field">
        <b-form-input id="name-field" :state="inputState($v.name)" v-model.trim="$v.name.$model" />
      </b-form-group>
      <b-form-group label="Курс" label-for="course-field">
        <b-form-input
          type="number"
          min="1"
          max="6"
          id="course-field"
          :state="inputState($v.course)"
          v-model.number.trim="$v.course.$model"
        />
      </b-form-group>
      <b-btn block v-b-toggle.confirm-delete variant="danger">Удалить дисциплину</b-btn>
      <b-collapse id="confirm-delete">
        <btn-loader
          class="mt-2"
          variant="dark"
          block
          @click="deleteSubject"
          load="deleteSubjectBtn"
          or="Действие необратимо. Продолжить?"
        />
      </b-collapse>

      <template #modal-footer>
        <b-btn @click="resetModal('edit-form')" variant="light">Отмена</b-btn>
        <btn-loader
          load="updateSubjectBtn"
          or="Обновить"
          @click="editSubject"
          variant="success"
          :disabled="$v.$invalid || notChanged"
        />
      </template>
    </b-modal>
  </b-container>
  <loader v-else />
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import TaskList from '@/components/teacher/TaskList'
import Loader from '@/components/Loader'
import baseMixin from '@/mixins/base'

export default {
  components: { Loader, BtnLoader, TaskList },
  mixins: [
    baseMixin({
      name: null,
      course: null
    })
  ],
  computed: {
    subj() {
      return this.$store.state.teacher.subjects
        ? this.$store.state.teacher.subjects.find(x => x.id === this.$route.params.id)
        : null
    },
    notChanged() {
      return this.name === this.subj.name && this.course === this.subj.course
    }
  },
  watch: {
    name() {
      if (this.name === this.subj.name)
        this.$v.name.$reset()
    },
    course() {
      if (this.course === this.subj.course)
        this.$v.course.$reset()
    }
  },
  async created() {
    if (this.$store.state.teacher.subjects === null)
      await this.$store.dispatch('fetch')
    if (this.subj) document.title = this.subj.name
  },
  methods: {
    openModalWithEditData() {
      this.name = this.subj.name
      this.course = this.subj.course
      this.$refs['edit-form'].show()
    },
    async editSubject() {
      await this.$store.dispatch('updateSubject', {
        name: this.name,
        course: this.course,
        id: this.subj.id
      })
      this.resetModal('edit-form')
      document.title = this.subj.name
    },
    async deleteSubject() {
      await this.$store.dispatch('deleteSubject', this.subj.id)
      this.$router.push('/subjects')
    }
  },
  validations: {
    name: { required },
    course: { required }
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 0;
  .edit-icon {
    transition: opacity 0.3s;
    opacity: 0;
    cursor: pointer;
    &:hover {
      opacity: 0.4 !important;
    }
  }
  &:hover {
    .edit-icon {
      opacity: 0.1;
    }
  }
}
</style>