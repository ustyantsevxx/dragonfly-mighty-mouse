<template>
  <main>
    <b-container>
      <b-row>
        <b-col md="8">
          <b-nav tabs class="border-0 course-list-nav">
            <b-container class="px-0">
              <b-row no-gutters class="d-flex justify-content-between">
                <b-col md="auto" order-md="2">
                  <div class="d-flex add-search">
                    <div>
                      <li class="filter" v-if="subjects && subjects.length">
                        <b-input-group size="sm">
                          <b-input-group-prepend is-text>
                            <b-icon icon="search" />
                          </b-input-group-prepend>
                          <b-input type="search" v-model.trim="filter" />
                        </b-input-group>
                      </li>
                    </div>
                    <div>
                      <b-link v-if="isTeacher" class="ml-2" v-b-modal.modal-subject>Добавить</b-link>
                    </div>
                  </div>
                </b-col>
                <b-col md="auto" order-md="1">
                  <div class="d-flex">
                    <b-nav-item to="/subjects" exact-active-class="active">Все курсы</b-nav-item>
                    <b-nav-item
                      v-for="(c, i) in coursesList"
                      :key="i"
                      :to="`?course=${c}`"
                      exact-active-class="active"
                    >{{ c }}</b-nav-item>
                  </div>
                </b-col>
              </b-row>
            </b-container>
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
    <subject-modal
      id="modal-subject"
      ref="modal-subject"
      ok-variant="success"
      cancel-variant="light"
      title="Добавление дисциплины"
      ok-title="Добавить"
      centered
      cancel-title="Отмена"
    />
    <!-- /invisible -->
  </main>
</template>

<script>
import SubjectModal from '@/components/modals/SubjectModal'
import TextHighlight from 'vue-text-highlight'

export default {
  components: { TextHighlight, SubjectModal },

  data: () => ({
    filter: null,
    tableHeaders: [
      { key: 'name', label: 'Название', sortable: true },
      { key: 'course', label: 'Курс', sortable: true }
    ]
  }),

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
  }
}
</script>

<style lang="scss" scoped>
.empty-msg {
  text-align: center;
  font-size: 2em;
}

.filter {
  margin-left: auto;
  margin-bottom: 5px;
  align-self: flex-end;
}

.course-list-nav {
  align-items: center;
  li a {
    color: #212529 !important;
  }
}

/deep/ mark {
  padding: 0 !important;
  background: rgb(231, 231, 231) !important;
}

@media screen and (max-width: 768px) {
  .add-search {
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
}
</style>