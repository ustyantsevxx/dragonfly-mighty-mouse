<template>
  <b-container v-if="subj">
    <b-row align-h="center" class="editable" title="Нажмите для редактирования">
      <b-col>
        <h1>
          <b-link @click.prevent="openModalWithEditData">
            {{ subj.name }}
            <b-badge variant="primary">{{subj.course}} курс</b-badge>
          </b-link>
        </h1>
      </b-col>
    </b-row>

    <b-row align-h="center">
      <b-col>
        <hr />
      </b-col>
    </b-row>

    <b-modal
      centered
      title="Редактирование дисциплины"
      ok-title="Обновить"
      cancel-title="Отмена"
      ref="edit-form"
      :ok-disabled="$v.$invalid"
      @hide="resetData"
      ok-variant="success"
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
          v-model.trim="$v.course.$model"
        />
      </b-form-group>
      <b-btn block v-b-toggle.confirm-delete variant="danger">Удалить дисциплину</b-btn>
      <b-collapse id="confirm-delete" class="mt-2">
        <btn-loader
          variant="dark"
          block
          @click="deleteSubject"
          load="deleteSubjectBtn"
          or="Действие необратимо. Продолжить?"
        />
      </b-collapse>
    </b-modal>
  </b-container>
  <loader v-else />
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import Loader from '@/components/Loader'
import baseMixin from '@/mixins/base'

export default {
  components: { Loader, BtnLoader },
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