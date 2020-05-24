<template>
  <b-modal
    v-bind="$attrs"
    @hide="resetModal('fake-student-modal')"
    @show="beforeShow"
    centered
    title="Изменение записи студента"
  >
    <b-form-group label="Имя">
      <b-input
        :state="inputState($v.newName)"
        v-model.trim="$v.newName.$model"
      />
    </b-form-group>

    <b-form-group label="Фамилия">
      <b-input
        :state="inputState($v.newSurname)"
        v-model.trim="$v.newSurname.$model"
      />
    </b-form-group>

    <template #modal-footer>
      <confirm-button
        @click="deleteStudent()"
        variant="outline-danger"
        class="mr-auto"
        text="Удалить запись"
      />
      <b-btn @click="resetModal('fake-student-modal')" variant="light">
        Закрыть
      </b-btn>
      <loading-button
        @click="updateStudent()"
        :load="loadUpdate"
        variant="info"
        :disabled="$v.$invalid"
      >
        Обновить
      </loading-button>
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import LoadingButton from '@/components/LoadingButton'
import modalMixin from '@/mixins/modal'
import ConfirmButton from '@/components/ConfirmationButton'
import {
  DELETE_STUDENT_FROM_GROUP,
  UPDATE_FAKE_STUDENT
} from '@/store/actions.type'

export default {
  props: {
    studentId: {
      type: String,
      default: null
    },
    groupId: {
      type: String,
      default: null
    },
    studentData: {
      type: Object,
      default: null
    }
  },

  components: { LoadingButton, ConfirmButton },

  mixins: [
    modalMixin({
      newName: null,
      newSurname: null
    })
  ],

  data: () => ({
    loadUpdate: false
  }),

  computed: {
    student() {
      const group = this.$store.state.groups.find(g => g.id === this.groupId)
      return group.students.find(s => s.id === this.studentId)
    }
  },

  methods: {
    beforeShow() {
      this.newName = this.student.name
      this.newSurname = this.student.surname
    },

    async updateStudent() {
      this.loadUpdate = true
      await this.$store.dispatch(UPDATE_FAKE_STUDENT, {
        id: this.studentId,
        name: this.newName,
        surname: this.newSurname
      })
      this.resetModal('fake-student-modal')
      this.loadUpdate = false
    },

    deleteStudent() {
      this.resetModal('fake-student-modal')
      this.$store.dispatch(DELETE_STUDENT_FROM_GROUP, {
        studentId: this.studentId,
        marksToDelete: this.studentData.marks,
        groupId: this.groupId,
        fake: this.studentData.fake
      })
    }
  },

  validations: {
    newName: { required },
    newSurname: { required }
  }
}
</script>
