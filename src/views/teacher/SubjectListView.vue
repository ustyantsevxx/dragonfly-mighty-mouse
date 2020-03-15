<template>
  <main>
    <b-container>
      <b-row>
        <b-col md="4" order-md="2">
          <b-btn v-if="isTeacher" variant="primary" v-b-modal.add-form>Добавить</b-btn>
        </b-col>

        <b-col md="8" order-md="1">
          <b-nav tabs class="border-0 ss-nav">
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
                <b-input type="search" v-model.trim="filter" />
              </b-input-group>
            </li>
          </b-nav>

          <b-table
            :fields="tableHeaders"
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
      </b-row>
    </b-container>

    <!-- invisible -->
    <b-modal
      centered
      title="Добавление дисциплины"
      ok-title="Добавить"
      cancel-title="Отмена"
      id="add-form"
      :ok-disabled="$v.$invalid"
      @ok="addSubject"
      @hide="resetData"
      ok-variant="success"
      cancel-variant="light"
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
    <!-- /invisible -->
  </main>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import baseMixin from '@/mixins/base'
import TextHighlight from 'vue-text-highlight'

export default {
  components: { TextHighlight },
  mixins: [
    baseMixin({
      name: null,
      course: null,
      filter: null,
      tableHeaders: [
        { key: 'name', label: 'Название', sortable: true },
        { key: 'course', label: 'Курс', sortable: true }
      ]
    })
  ],
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
    },
    isTeacher() {
      return this.$store.state.user.isTeacher
    }
  },
  methods: {
    async addSubject() {
      await this.$store.dispatch('addSubject', { name: this.name, course: this.course })
      this.resetData()
    }
  },
  validations: {
    name: { required },
    course: { required }
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

.ss-nav li a {
  color: #212529 !important;
}

mark {
  padding: 0 !important;
  background: rgb(231, 231, 231) !important;
}
</style>