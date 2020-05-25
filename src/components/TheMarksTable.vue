<template>
  <div v-if="students.length">
    <b-check
      v-if="isTeacher && !allTasksVisible"
      v-model="showAllTasks"
      class="mt-3"
    >
      Показать закрытые задания
    </b-check>

    <b-table
      v-if="marks && tasks"
      @sort-changed="closePopover"
      class="app__marks_table mt-3 shadow-sm"
      :fields="tableHeaders"
      :items="tableItems"
      sort-by="name"
      responsive="sm"
      small
      bordered
      details-td-class="p-0"
      thead-tr-class="text-reset g__noselect bg-light"
    >
      <template #head()="data">
        <div :id="data.field.key">
          {{ data.label }}
        </div>
        <b-tooltip
          v-if="data.field.tooltipEnable"
          :container="data.field.key"
          triggers="hover"
          :target="data.field.key"
        >
          {{ data.field.name }}
        </b-tooltip>
      </template>

      <template #cell(index)="data">
        <span
          :class="{ 'text-primary font-weight-bold': data.item.fake }"
          :title="data.item.fake ? 'Фиктивная запись' : 'Реальный студент'"
        >
          {{ data.index + 1 }}
        </span>
      </template>

      <template #cell(name)="data">
        <div
          @click="isTeacher && data.toggleDetails()"
          :title="data.detailsShowing ? 'Скрыть детали' : 'Показать детали'"
          :class="{
            'text-primary': data.detailsShowing,
            g__pointer: isTeacher
          }"
        >
          {{ data.value }}
        </div>
      </template>

      <template #row-details="data">
        <div class="p-3 bg-light">
          <div v-if="data.item.email" class="mb-2">
            <b-link :href="`mailto:${data.item.email}`">
              {{ data.item.email }}
            </b-link>
          </div>
          <b-btn
            v-if="data.item.fake"
            @click="openModal(data.item)"
            class="mr-2"
            variant="dark"
            size="sm"
          >
            Редактировать запись
          </b-btn>
          <confirm-button
            v-else
            @click="deleteStudent(data)"
            size="sm"
            variant="danger"
            confirm-text="Действие необратимо. Продолжить?"
          >
            Удалить студента
          </confirm-button>
        </div>
      </template>

      <template #cell()="data">
        <div
          @click="taskClickAction(data)"
          :id="data.item.id + data.field.key"
          class="app__score_cell"
        >
          <div :class="getExtraMarkClass(data.value.score, data.field.score)">
            {{ data.value.score }}
          </div>
        </div>
      </template>

      <template #cell(total)="data">
        <div class="app__chart" :style="getChartCellStyle(data.value)"></div>
        <div class="app__chart_value">{{ data.value }}</div>
      </template>
    </b-table>

    <!-- invisible -->
    <div class="d-none" id="popover-initial"></div>
    <b-popover
      custom-class="shadow-sm p-1"
      :target="popoverTarget"
      ref="popover"
    >
      <div class="d-flex justify-content-center align-items-center">
        <div>
          <b-spinbutton
            v-model="selectedMarkScore"
            @change="debounce_updateMark"
            class="border-0"
            size="sm"
            min="0"
          />
        </div>
        <div
          @click="deleteMark()"
          class="g__pointer app__del_icon border-left px-2"
          title="Удалить"
        >
          <b-icon variant="danger" icon="x" title="Удалить" scale="1.5" />
        </div>
      </div>
    </b-popover>

    <fake-student-modal
      id="fake-student-modal"
      :student-id="idToEdit"
      :group-id="groupId"
      :student-data="studentData"
    />
    <!-- /invisible -->
  </div>

  <b-alert v-else class="m-0 mt-3" show variant="info">
    <b-link @click.prevent="$parent.openModal(true)" class="alert-link">
      Пригласите студентов в группу по ссылке или добавьте временные записи
      вручную.
    </b-link>
  </b-alert>
</template>

<script>
import { mapState } from 'vuex'
import {
  MARK_TASK,
  UPDATE_MARK,
  DELETE_MARK,
  DELETE_STUDENT_FROM_GROUP
} from '@/store/actions.type'
import ConfirmButton from '@/components/ConfirmationButton'
import FakeStudentModal from '@/components/FakeStudentModal'
import { debounce } from 'debounce'

export default {
  props: {
    groupId: {
      type: String,
      required: true
    }
  },

  components: { ConfirmButton, FakeStudentModal },

  data: () => ({
    popoverTarget: 'popover-initial',
    selectedMark: null,
    selectedMarkScore: null,
    debounceTimer: null,
    showAllTasks: false,
    idToEdit: null,
    studentData: null
  }),

  computed: {
    ...mapState({
      group(s) {
        return s.groups.find(g => g.id === this.groupId)
      },
      marks: s => s.marks,
      tasks(s) {
        return this.showAllTasks
          ? s.tasks
          : s.tasks.filter(task => task.visible)
      },
      allTasksVisible: s => s.tasks.every(t => t.visible),
      isTeacher: s => s.user.isTeacher
    }),

    totalScore() {
      return this.tasks.reduce((t, c) => t + c.score, 0)
    },

    students() {
      return this.group.students
    },

    tableHeaders() {
      let tableHeaders = [
        {
          label: '#',
          key: 'index'
        },
        {
          label: 'Студент',
          key: 'name',
          tdClass: 'font-weight-bold text-nowrap',
          stickyColumn: true,
          sortable: true
        }
      ]

      let labNumbers = [...this.tasks].sort((a, b) => a.number - b.number)
      labNumbers.forEach(t =>
        tableHeaders.push({
          label: `Лаб-${t.number}`,
          key: t.id,
          name: t.name,
          tooltipEnable: true,
          score: t.score,
          sortable: true,
          thClass: `text-nowrap align-middle  ${
            t.visible ? '' : ' text-danger'
          }`,
          tdClass: this.isTeacher ? 'app__hoverable_cell' : 'text-center'
        })
      )

      tableHeaders.push({
        label: `Всего\u00a0(${this.totalScore})`,
        key: 'total',
        tdClass:
          'app__chart_container font-weight-bold border-left text-center',
        thClass: 'border-left align-middle',
        sortable: true
      })

      return tableHeaders
    },

    tableItems() {
      return this.students.map(student => {
        let name = student.surname + ' '
        if (!this.isMobile() && student) name += student.name
        else if (student.name) name += student.name[0] + '.'
        let row = {
          name,
          fake: student.fake,
          email: student.email,
          id: student.id,
          total: 0,
          marks: []
        }
        let studentsMarks = this.marks.filter(m => m.student.id === student.id)
        studentsMarks.forEach(mark => {
          if (!mark.task) return
          row[mark.task.id] = {
            id: mark.id,
            score: mark.score
          }
          row.marks.push(mark.id)
          if (mark.task.visible || this.showAllTasks) row.total += mark.score
        })
        return row
      })
    }
  },

  methods: {
    openModal(data) {
      this.idToEdit = data.id
      this.studentData = data
      this.$nextTick(() => this.$bvModal.show('fake-student-modal'))
    },
    deleteStudent(data) {
      this.$store.dispatch(DELETE_STUDENT_FROM_GROUP, {
        studentId: data.item.id,
        marksToDelete: data.item.marks,
        groupId: this.groupId,
        fake: data.item.fake
      })
    },

    taskClickAction(data) {
      if (!this.isTeacher) return
      const markData = {
        studentId: data.item.id,
        taskId: data.field.key,
        groupId: this.groupId,
        subjectId: this.$route.params.id,
        score: data.field.score,
        fake: data.item.fake
      }

      if (data.value) {
        this.closePopover()
        this.popoverTarget = `${data.item.id}${data.field.key}`
        this.selectedMark = data.item[data.field.key]
        this.selectedMarkScore = data.item[data.field.key].score
        this.$nextTick(() =>
          this.$nextTick(() => this.$refs.popover.$emit('open'))
        )
      } else {
        this.$store.dispatch(MARK_TASK, markData)
      }
    },
    debounce_updateMark: debounce(function () {
      this.$store.dispatch(UPDATE_MARK, {
        id: this.selectedMark.id,
        score: this.selectedMarkScore
      })
      this.closePopover()
    }, 500),
    async deleteMark() {
      this.$store.dispatch(DELETE_MARK, this.selectedMark.id)
      this.closePopover()
    },
    closePopover() {
      this.$refs.popover.$emit('close')
    },
    getExtraMarkClass(actual, taskScore) {
      if (actual > taskScore) return 'font-weight-bold text-success'
      if (actual < taskScore) return 'font-weight-bold text-danger'
      return ''
    },
    getWidthOfTotalCell(value) {
      if (value >= this.totalScore) return 100
      return (value / this.totalScore) * 100
    },
    getScaleColor(perc) {
      return perc >= 100 ? '#335eea' : `hsl(${(perc / 100) * 120}, 100%, 50%)`
    },
    getChartCellStyle(value) {
      return {
        width: this.getWidthOfTotalCell(value) + '%',
        background: this.getScaleColor(this.getWidthOfTotalCell(value))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .app__chart_container {
    position: relative;
    background: white !important;

    .app__chart {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      opacity: 0.2;
      z-index: 5;
      transition: width 0.3s;
    }

    .app__chart_value {
      width: 100%;
      left: 0;
      position: absolute;
      z-index: 10;
    }
  }

  .app__marks_table {
    width: max-content;
    margin-bottom: 0;

    .app__hoverable_cell {
      cursor: pointer;
      transition: background-color 0.09s ease-in-out;
      position: relative;
      padding: 0;

      &:hover {
        background-color: $light !important;
      }

      .app__score_cell {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  :focus {
    outline: none !important;
  }

  .table.b-table > thead > tr > [aria-sort='none'] {
    background-size: 0;

    &:hover {
      background-size: 0.65em 1em;
    }
  }

  .table.b-table > thead > tr > .table-b-table-default {
    background-color: $light;
  }

  .table-bordered thead th,
  .table-bordered thead td {
    border-bottom-width: 0;
  }

  .popover-body {
    padding: 0 !important;
    border: 0 !important;
  }

  .app__del_icon {
    &:hover {
      .bi {
        transform: scale(1.2) !important;
      }
    }
  }
}

@include media-breakpoint-down(sm) {
  .app__marks_table {
    width: 100%;
  }
}
</style>
