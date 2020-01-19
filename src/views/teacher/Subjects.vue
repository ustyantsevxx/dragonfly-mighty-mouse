<template>
  <b-container>
    <b-row>
      <b-col md="4" order-md="2">
        <b-btn variant="primary" v-b-modal.add-form>Добавить</b-btn>
      </b-col>

      <b-col md="8" order-md="1">
        <b-nav tabs class="border-0">
          <b-nav-item to="/subjects" exact-active-class="active">Все курсы</b-nav-item>
          <b-nav-item
            v-for="(c, i) in coursesList"
            :key="i"
            :to="`?course=${c}`"
            exact-active-class="active"
          >{{ c }}</b-nav-item>
          <li class="filter" v-if="subjects && subjects.length">
            <b-input-group size="sm">
              <b-input-group-prepend is-text>
                <b-icon icon="search" />
              </b-input-group-prepend>
              <b-input v-model.trim="filter" @keydown.esc="filter = null" />
            </b-input-group>
            <transition name="fade">
              <span v-if="filter" @click="filter = null" id="searchclear">
                <b-icon icon="x-circle" />
              </span>
            </transition>
          </li>
        </b-nav>

        <b-table
          :fields="fields"
          :items="subjectsByCourse"
          :filter="filter"
          sort-by="course"
          show-empty
          hover
          bordered
          class="bg-white pointer"
          @row-clicked.once="$router.push(`subjects/${$event.id}`)"
        >
          <template #empty>
            <div class="text-center text-muted">Список дисциплин пуст</div>
          </template>
          <template #emptyfiltered>
            <div class="text-center text-muted">По запросу ничего не найдено</div>
          </template>
          <template #cell(name)="data">
            <text-highlight v-if="filter" :queries="filter">{{ data.item.name }}</text-highlight>
            <template v-else>{{ data.item.name }}</template>
          </template>
        </b-table>
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
            max="6"
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
import TextHighlight from 'vue-text-highlight'

export default {
  mixins: [
    baseMixin({
      name: null,
      course: null,
      filter: null,
      fields: [
        { key: 'name', label: 'Название', sortable: true },
        { key: 'course', label: 'Курс', sortable: true }
      ]
    })
  ],

  components: { TextHighlight },

  beforeCreate() {
    this.$store.dispatch('fetch')
  },

  validations: {
    name: { required },
    course: { required }
  },

  computed: {
    subjects() { return this.$store.state.teacher.subjects },
    subjectsByCourse() {
      if (this.subjects) {
        if (this.$route.query.course) {
          let ar = [...this.subjects]
          ar = ar.filter(x => x.course === +this.$route.query.course)
          return ar
        }
        return this.subjects
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

<style>
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

mark {
  padding: 0 !important;
  background: var(--light) !important;
}
</style>