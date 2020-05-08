<template>
  <main>
    <b-container>
      <b-row>
        <b-col>
          <h1 class="m-0" v-mobile-class="'text-center'">Мои дисциплины</h1>
          <hr />
        </b-col>
      </b-row>

      <b-row class="mb-3">
        <b-col md="8">
          <b-table
            :fields="tableHeaders"
            :items="subjectsByCourse"
            :filter="filter"
            sort-by="course"
            show-empty
            hover
            thead-class="border-bottom"
            borderless
            class="bg-white pointer shadow-sm rounded"
            @row-clicked.once="$router.push(`subjects/${$event.id}`)"
          >
            <template #empty>
              <div class="text-center text-muted">Список дисциплин пуст</div>
            </template>
            <template #emptyfiltered>
              <div class="text-center text-muted">
                По запросу ничего не найдено
              </div>
            </template>
            <template #cell(name)="data">
              <text-highlight v-if="filter" :queries="filter">
                {{ data.item.name }}
              </text-highlight>
              <template v-else>{{ data.item.name }}</template>
            </template>
          </b-table>
        </b-col>

        <b-col md="4">
          <b-card
            class="border-0 shadow-sm mb-3"
            v-if="subjects && subjects.length > 1"
          >
            <div class="mb-2 font-weight-bold">Курс обучения</div>
            <b-nav pills class="tabs-nav">
              <b-nav-item
                to="/subjects"
                exact-active-class="active link-active"
              >
                Все
              </b-nav-item>
              <b-nav-item
                v-for="(c, i) in coursesList"
                :key="i"
                :to="`?course=${c}`"
                exact-active-class="active link-active"
              >
                {{ c }}
              </b-nav-item>
            </b-nav>
          </b-card>

          <b-card class="border-0 shadow-sm">
            <div v-if="subjects && subjects.length">
              <b-input-group>
                <b-input-group-prepend is-text>
                  <b-icon icon="search" />
                </b-input-group-prepend>
                <b-input
                  type="search"
                  v-model.trim="filter"
                  placeholder="Поиск по названию"
                />
              </b-input-group>
            </div>
            <b-btn
              variant="success"
              block
              :class="{ 'mt-3': subjects && subjects.length }"
              v-if="isTeacher"
              v-b-modal.modal-subject
            >
              Добавить дисциплину
            </b-btn>
          </b-card>
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
      cancel-title="Отмена"
    />
    <!-- /invisible -->
  </main>
</template>

<script>
import SubjectModal from '@/components/SubjectModal'
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
    subjects() {
      return this.$store.state.subjects
    },
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
  align-self: flex-end;
  list-style: none;
}

.add-btn-container {
  display: flex;
  align-items: center;
}

/deep/ {
  .link-active {
    transition: background-color 0.17s ease-in-out;
    color: white !important;
  }

  li a {
    color: black;
    transition: background-color 0.17s ease-in-out;

    &:hover {
      background-color: #e9ecef;
    }
  }
  mark {
    padding: 0 !important;
    background: rgb(231, 231, 231) !important;
  }
}

@media screen and (max-width: 768px) {
  .add-search {
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
}
</style>
