<template>
  <b-container v-if="subj">
    <b-row>
      <b-col>
        <h1 class="header">
          {{ subj.name }}
          <b-icon
            icon="pencil"
            @click="openModalWithEditData"
            class="hover-icon"
            title="Редактировать"
          />
        </h1>
      </b-col>
    </b-row>

    <b-row>
      <b-col class="badges mt-2">
        <b-badge variant="info" class="mr-2">{{subj.course}} курс</b-badge>
        <b-badge variant="success" class="mr-2">{{subj.tasklist.length}} лаб</b-badge>
        <b-badge variant="danger">0 групп</b-badge>
      </b-col>
    </b-row>

    <hr class="my-4" />

    <task-list />

    <hr class="my-4" />

    <group-list />

    <!-- invisible -->
    <b-modal centered title="Редактирование дисциплины" ref="edit-form">
      <b-form-group label="Название">
        <b-form-input :state="inputState($v.name)" v-model.trim="$v.name.$model" />
      </b-form-group>
      <b-form-group label="Курс">
        <b-form-input
          type="number"
          min="1"
          max="6"
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
    <!-- /invisible -->
  </b-container>
  <page-loader v-else />
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import TaskList from '@/components/teacher/TaskList'
import GroupList from '@/components/teacher/GroupList'
import PageLoader from '@/components/PageLoader'
import baseMixin from '@/mixins/base'

export default {
  components: { PageLoader, BtnLoader, TaskList, GroupList },
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
    },
    subj() {
      if (this.subj) document.title = this.subj.name
    }
  },
  mounted() {
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
    },
    deleteSubject() {
      this.$store.dispatch('deleteSubject', this.subj.id)
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
  &:hover {
    .hover-icon {
      opacity: 0.1;
    }
  }
}

.badges {
  span {
    font-size: 1em;
  }
}
</style>