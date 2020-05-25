<template>
  <b-modal
    v-bind="$attrs"
    @hide="resetModal('fake-student-modal')"
    @show="beforeShow"
    centered
    title="Изменение записи студента"
  >
    <b-form-group label="Фамилия">
      <b-input
        :state="inputState($v.newSurname)"
        v-model.trim="$v.newSurname.$model"
      />
    </b-form-group>

    <b-form-group label="Имя">
      <b-input
        :state="inputState($v.newName)"
        v-model.trim="$v.newName.$model"
      />
    </b-form-group>

    <hr class="m-0" />

    <b-collapse v-model="collapsed" id="students-collapse">
      <b-list-group class="mt-3">
        <b-list-group-item
          v-for="(stud, i) in $parent.students.filter(x => !x.fake)"
          :key="i"
          @click="checkStudent(stud)"
          class="p-2 app__student"
          :class="{
            'bg-light font-weight-bold text-success':
              checkedStudent && checkedStudent.id === stud.id
          }"
        >
          <div>{{ `${stud.surname} ${stud.name}` }}</div>
          <div
            v-if="checkedStudent && checkedStudent.id === stud.id"
            class="text-success mr-2"
          >
            <b-icon icon="check" scale="1.5" />
          </div>
        </b-list-group-item>
      </b-list-group>
    </b-collapse>

    <b-btn-group class="w-100 mt-3">
      <b-btn
        variant="info"
        block
        @click="buttonAction()"
        :disabled="!$parent.students.filter(x => !x.fake).length"
        :title="
          !$parent.students.filter(x => !x.fake).length
            ? 'В группе нет настоящих студентов'
            : ''
        "
      >
        <span v-if="checkedStudent">
          Объединить с
          {{ `${checkedStudent.surname} ${checkedStudent.name}` }}
        </span>
        <span v-else-if="!checkedStudent && collapsed">Выберите студента</span>
        <span v-else>Объединить запись</span>
      </b-btn>
      <b-btn id="info-button" variant="outline-info">
        ?
        <b-popover triggers="hover" target="info-button">
          Перенести все отметки с данной записи на реального студента и удалить
          фиктивную запись.
          <br />
          Внимание: при этом будут удалены все отметки настоящего студента и
          заменены отметками с данной записи
        </b-popover>
      </b-btn>
    </b-btn-group>

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
  UPDATE_FAKE_STUDENT,
  UNION_FAKE_STUDENT_WITH_REAL
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
      newSurname: null,
      checkedStudent: null,
      collapsed: false
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
    },

    checkStudent(stud) {
      this.checkedStudent = stud
    },

    async buttonAction() {
      if (!this.checkedStudent) this.collapsed = !this.collapsed
      else {
        await this.$store.dispatch(UNION_FAKE_STUDENT_WITH_REAL, {
          realId: this.checkedStudent.id,
          fakeId: this.studentId,
          groupId: this.groupId,
          subjectId: this.$route.params.id
        })
        this.resetModal('fake-student-modal')
      }
    }
  },

  validations: {
    newName: { required },
    newSurname: { required }
  }
}
</script>

<style lang="scss" scoped>
.app__student {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.17s ease-in-out;
  background-color: white;

  &:hover {
    background-color: darken($light, 2);
  }
}
</style>
