<template>
  <b-container>
    <b-row>
      <b-col md="4" order-md="2">
        <b-btn variant="primary" v-b-modal.add-form>Добавить</b-btn>
      </b-col>

      <b-col md="8" order-md="1">
        <b-nav tabs class="border-0" v-if="subjects && subjects.length && coursesList.length > 1">
          <b-nav-item to="/subjects" exact-active-class="active">Все курсы</b-nav-item>
          <b-nav-item
            v-for="(c, i) in coursesList"
            :key="i"
            :to="`?course=${c}`"
            exact-active-class="active"
          >{{ c }}</b-nav-item>
          <li class="filter">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>
                <b-icon icon="search" />
              </b-input-group-prepend>
              <b-input v-model="filter" @keydown.enter="goIfOneResult" />
            </b-input-group>
            <transition name="fade">
              <span v-if="filter" @click="filter = null" id="searchclear">
                <b-icon icon="x-circle" />
              </span>
            </transition>
          </li>
        </b-nav>

        <template v-if="subjectsSorted && subjectsSorted.length">
          <table class="table table-bordered table-hover bg-white">
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
        </template>
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
          <b-form-input id="name-field" :state="inputState($v.name)" v-model.trim="$v.name.$model" />
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
  </b-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import baseMixin from '@/mixins/base'

export default {
  mixins: [
    baseMixin({
      name: null,
      course: null,
      filter: null
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
        if (this.filter) {
          ar = ar.filter(x => x.name.toLowerCase()
            .includes(this.filter.toLowerCase()))
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
    },
    goIfOneResult() {
      if (this.filter && this.subjectsSorted.length === 1) {
        this.$router.push(`subjects/${this.subjectsSorted[0].id}`)
      }
    }
  }
}
</script>

<style scoped>
.empty-msg {
  text-align: center;
  font-size: 2em;
}

.filter {
  margin-left: auto;
  margin-bottom: 5px;
  align-self: flex-end;
  position: relative;
}

#searchclear {
  position: absolute;
  right: 0.5em;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #a6acb4;
  z-index: 100;
}
</style>