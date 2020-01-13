<template>
  <b-container>
    <b-row>
      <b-col md="8">
        <table
          v-if="subjects && subjects.length"
          class="table table-bordered table-hover"
        >
          <thead>
            <tr>
              <th>Название</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(s, i) in subjects"
              :key="i"
              @click="$router.push(`subjects/${s.id}`)"
            >
              <td>{{ s.name }}</td>
              <td>{{ s.course }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-msg text-muted">Список дисциплин пуст</div>
      </b-col>

      <b-col md="4">
        <b-btn variant="primary" v-b-modal.add-form>Добавить</b-btn>
      </b-col>

      <b-modal
        centered
        title="Добавление дисциплины"
        ok-title="Сохранить"
        cancel-title="Отмена"
        id="add-form"
        @ok="addSubject"
        @hide="resetData"
        ok-variant="success"
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
            max="10"
            id="course-field"
            :state="inputState($v.course)"
            v-model.trim="$v.course.$model"
          />
        </b-form-group>
      </b-modal>
    </b-row>
    <router-view />
  </b-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import baseMixin from '@/mixins/base'

export default {
  mixins: [
    baseMixin({
      name: null,
      course: null
    })
  ],

  beforeCreate() {
    this.$store.dispatch('fetch')
  },

  validations: {
    name: { required },
    course: { required }
  },

  computed: {
    subjects() { return this.$store.state.teacher.subjects }
  },

  methods: {
    async addSubject() {
      this.$store.dispatch('addSubject', { name: this.name, course: this.course })
      this.resetData()
    }
  }
}
</script>

<style scoped>
.empty-msg {
  text-align: center;
  font-size: 2em;
}
</style>