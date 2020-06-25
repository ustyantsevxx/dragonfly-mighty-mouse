<template>
  <b-modal
    centered
    @show="beforeShow"
    v-bind="$attrs"
    :ok-disabled="$v.$invalid"
    @ok="okAction"
    @hide="resetModal('modal-subject')"
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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { required, between } from 'vuelidate/lib/validators'
import ConfirmButton from '@/components/ConfirmationButton.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import { ISubject, SubjectsModule } from '../store/modules/subjects'
import { Validation } from 'vuelidate'

@Component({
  components: { ConfirmButton, LoadingButton },
  validations: {
    name: { required },
    course: { required, between: between(1, 10) }
  }
})
export default class extends Vue {
  @Prop() subject!: ISubject

  name = ''
  course = 1
  loadButton = false

  beforeShow() {
    if (this.subject) {
      this.name = this.subject.name
      this.course = +this.subject.course
    }
  }

  async okAction() {
    this.loadButton = true
    this.subject ? await this.editSubject() : await this.addSubject()
    this.resetModal('modal-subject')
    this.loadButton = false
  }

  inputState(val: Validation) {
    return val.$dirty ? !val.$error : null
  }

  resetModal(modalRef: string) {
    this.name = ''
    this.course = 1
    this.$bvModal.hide(modalRef)
    this.$v.$reset()
  }

  async addSubject() {
    await SubjectsModule.AddSubject({
      name: this.name,
      course: this.course
    })
  }

  async editSubject() {
    await SubjectsModule.UpdateSubject({
      id: this.subject.id,
      name: this.name,
      course: this.course
    })
  }

  async deleteSubject() {
    await SubjectsModule.DeleteSubject(this.subject.id)
    this.$router.push('/subjects')
  }
}
</script>
