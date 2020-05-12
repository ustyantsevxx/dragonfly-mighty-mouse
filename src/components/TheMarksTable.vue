<template>
  <div v-if="students.length">
    <b-check
      v-model="showAllTasks"
      class="mt-3"
      v-if="isTeacher && !allTasksVisible"
    >
      Показать закрытые задания
    </b-check>

    <b-table
      :fields="tableHeaders"
      :items="tableItems"
      sort-by="name"
      responsive="sm"
      bordered
      striped
      v-if="marks && tasks"
      small
      thead-tr-class="text-reset"
      @sort-changed="closePopover"
      class="app__marks_table mt-3"
    >
      <template #head()="data">
        <div :title="data.field.name">{{ data.label }}</div>
      </template>
      <template #cell(index)="data">{{ data.index + 1 }}</template>
      <template #cell(name)="data">
        <div
          @click="isTeacher && data.toggleDetails()"
          class="g__pointer"
          title="Развернуть"
          :class="{ 'text-danger': data.detailsShowing }"
        >
          {{ data.value }}
        </div>
      </template>

      <template #row-details="data">
        <b-btn size="sm" variant="danger" @click="deleteStudent(data)">
          Удалить студента
        </b-btn>
      </template>

      <template #cell()="data">
        <div
          class="app__score_cell"
          :id="data.item.id + data.field.key"
          @click="taskClickAction(data)"
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
    <b-popover custom-class="" :target="popoverTarget" ref="popover">
      <div>
        <b-spinbutton
          v-model="selectedMarkScore"
          @change="debounce_updateMark"
          size="sm"
          min="0"
          class="mb-2"
        />
        <b-button block size="sm" variant="danger" @click="deleteMark()">
          Удалить
        </b-button>
      </div>
    </b-popover>
    <!-- /invisible -->
  </div>
  <b-alert v-else show variant="info" class="m-0 mt-3">
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
import { debounce } from 'debounce'

export default {
  props: {
    groupId: {
      type: String,
      required: true
    }
  },

  data: () => ({
    popoverTarget: 'popover-initial',
    selectedMark: null,
    selectedMarkScore: null,
    debounceTimer: null,
    showAllTasks: false
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
        tdClass: 'app__chart_container border-left text-center',
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
          id: student.id,
          total: 0,
          marks: []
        }
        let studentsMarks = this.marks.filter(m => m.student.id === student.id)
        studentsMarks.forEach(mark => {
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
    deleteStudent(data) {
      this.$store.dispatch(DELETE_STUDENT_FROM_GROUP, {
        studentId: data.item.id,
        marksToDelete: data.item.marks,
        groupId: this.groupId
      })
    },

    taskClickAction(data) {
      if (!this.isTeacher) return
      const markData = {
        studentId: data.item.id,
        taskId: data.field.key,
        groupId: this.groupId,
        subjectId: this.$route.params.id,
        score: data.field.score
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
    }, 300),
    async deleteMark() {
      await this.$store.dispatch(DELETE_MARK, this.selectedMark.id)
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
    getScaleColor(percentage, maxHue = 120, minHue = 0) {
      const hue = (percentage / 100) * (maxHue - minHue) + minHue
      return `hsl(${hue}, 100%, 50%)`
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

  .table.b-table > thead > tr > [aria-sort='none'] {
    background-size: 0;

    &:hover {
      background-size: 0.65em 1em;
    }
  }
}

@include media-breakpoint-down(sm) {
  .app__marks_table {
    width: 100%;
  }
}
</style>
