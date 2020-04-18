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
    </b-form-group>

    <template v-if="subject">
      <confirm-btn
        block
        variant="danger"
        text="Удалить дисциплину"
        confirm-text="Действие необратимо. Продолжить?"
        @click="deleteSubject"
      />
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import modalMixin from '@/mixins/base'
import ConfirmBtn from '@/components/ConfirmationButton'
import {
  ADD_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT
} from '@/store/actions.type'

export default {
  components: { ConfirmBtn },

  props: {
    subject: {
      type: Object,
      default: null
    }
  },

  mixins: [
    modalMixin({
      name: null,
      course: null
    })
  ],

  methods: {
    beforeShow() {
      if (this.subject) {
        this.name = this.subject.name
        this.course = +this.subject.course
      }
    },
    okAction() {
      this.subject ? this.editSubject() : this.addSubject()
    },
    async addSubject() {
      console.log(1)
      await this.$store.dispatch(ADD_SUBJECT, {
        name: this.name,
        course: this.course
      })
      console.log(2)
      this.resetData()
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
    course: { required }
  }
}
</script>
