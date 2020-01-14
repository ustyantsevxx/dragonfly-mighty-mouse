<template>
  <b-container>
    <b-row>
      <b-col md="4" order-md="2">
        <b-btn variant="primary" v-b-modal.add-form>Добавить</b-btn>
      </b-col>
      <b-col md="8" order-md="1">
        <b-nav
          tabs
          class="border-0"
          v-if="subjects && subjects.length && coursesList.length > 1"
        >
          <b-nav-item to="/subjects" exact-active-class="active"
            >Все курсы</b-nav-item
          >
          <b-nav-item
            v-for="(c, i) in coursesList"
            :key="i"
            :to="`?course=${c}`"
            exact-active-class="active"
            >{{ c }}</b-nav-item
          >
        </b-nav>
        <table
          v-if="subjectsSorted && subjectsSorted.length"
          class="table table-bordered table-hover bg-white"
        >
          <thead>
            <tr>
              <th>Название</th>
              <th>Курс</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(s, i) in subjectsSorted"
              :key="i"
              style="cursor: pointer"
              @click.once="$router.push(`subjects/${s.id}`)"
            >
              <td>{{ s.name }}</td>
              <td>{{ s.course }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-msg text-muted">Список дисциплин пуст</div>
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
    subjects() { return this.$store.state.teacher.subjects },
    subjectsSorted() {
      if (this.subjects) {
        let ar = [...this.subjects]
        if (this.$route.query.course) {
          ar = ar.filter(x => x.course === +this.$route.query.course)
        }
        return ar.sort((a, b) => a.course - b.course || a.name.localeCompare(b.name))
      } else return []
    },
    coursesList() {
      return this.subjects
        ? [...new Set(this.subjects.map(x => x.course).sort())]
        : []
    }
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