<template>
  <b-modal
    @show="beforeShow"
    v-bind="$attrs"
    :ok-disabled="$v.$invalid"
    @ok="okAction"
    @hide="resetData"
  >
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

    <template v-if="subject">
      <b-btn block v-b-toggle.confirm-delete variant="danger">Удалить дисциплину</b-btn>
      <b-collapse id="confirm-delete">
        <btn-loader
          class="mt-2"
          variant="dark"
          block
          @click="deleteSubject"
          load="btn-deleteSubject"
          or="Действие необратимо. Продолжить?"
        />
      </b-collapse>
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import modalMixin from '@/mixins/base'
import BtnLoader from '@/components/BtnLoader'

export default {
  components: { BtnLoader },

  props: ['subject'],

  mixins: [
    modalMixin({
      name: null,
      course: null,
    })
  ],

  methods: {
    beforeShow() {
      if (this.subject) {
        this.name = this.subject.name
        this.course = this.subject.course
      }
    },
    okAction() {
      this.subject ? this.editSubject() : this.addSubject()
    },
    async addSubject() {
      await this.$store.dispatch('addSubject', { name: this.name, course: this.course })
      this.resetData()
    },
    async editSubject() {
      await this.$store.dispatch('updateSubject', {
        name: this.name,
        course: this.course,
        id: this.subject.id
      })
    },
    deleteSubject() {
      this.$store.commit('setLoading', 'btn-deleteSubject')
      this.$store.dispatch('deleteSubject', this.subject.id)
      this.$router.push('/subjects')
      this.$store.commit('unsetLoading')
    }
  },

  validations: {
    name: { required },
    course: { required }
  }
}
</script>