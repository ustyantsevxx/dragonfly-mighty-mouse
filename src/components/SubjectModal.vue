<template>
  <b-modal
    centered
    @show="beforeShow"
    v-bind="$attrs"
    :ok-disabled="$v.$invalid"
    @ok="okAction"
    @hide="resetData"
  >
    <b-form-group label="Название" label-for="name-field">
      <b-form-input
        id="name-field"
        :state="inputState($v.name)"
        v-model.trim="$v.name.$model"
      />
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
      <b-form-invalid-feedback v-if="!$v.course.between">
        Курс должен быть от 1 до 10.
      </b-form-invalid-feedback>
    </b-form-group>

    <template #modal-footer>
      <confirm-button
        v-if="subject"
        @click="deleteSubject()"
        variant="outline-danger"
        class="mr-auto"
        text="Удалить дисциплину"
      />
      <b-btn @click="resetModal('modal-subject')" variant="light">
        Закрыть
      </b-btn>
      <loading-button
        @click="okAction()"
        :load="loadButton"
        :variant="subject ? 'info' : 'success'"
        :disabled="$v.$invalid"
      >
        {{ subject ? 'Обновить' : 'Добавить' }}
      </loading-button>
    </template>
  </b-modal>
</template>

<script>
import { required, between } from 'vuelidate/lib/validators'
import modalMixin from '@/mixins/modal'
import ConfirmButton from '@/components/ConfirmationButton'
import LoadingButton from '@/components/LoadingButton'
import {
  ADD_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT
} from '@/store/actions.type'

export default {
  components: { ConfirmButton, LoadingButton },

  props: {
    subject: {
      type: Object,
      default: null
    }
  },

  mixins: [
    modalMixin({
      name: null,
      course: null,
      loadButton: false
    })
  ],

  methods: {
    beforeShow() {
      if (this.subject) {
        this.name = this.subject.name
        this.course = +this.subject.course
      }
    },
    async okAction() {
      this.loadButton = true
      this.subject ? await this.editSubject() : await this.addSubject()
      this.resetModal('modal-subject')
      this.loadButton = false
    },
    async addSubject() {
      await this.$store.dispatch(ADD_SUBJECT, {
        name: this.name,
        course: this.course
      })
    },
    async editSubject() {
      await this.$store.dispatch(UPDATE_SUBJECT, {
        name: this.name,
        course: this.course,
        id: this.subject.id
      })
    },
    deleteSubject() {
      this.$store.dispatch(DELETE_SUBJECT, this.subject.id)
      this.$router.push('/subjects')
    }
  },

  validations: {
    name: { required },
    course: { required, between: between(1, 10) }
  }
}
</script>
