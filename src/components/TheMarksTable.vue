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
      @sort-changed="closePopover"
      class="mt-3 marks-table"
    >
      <template #head()="data">
        <div v-b-tooltip.hover="data.field.name">{{ data.label }}</div>
      </template>
      <template #cell(index)="data">{{ data.index + 1 }}</template>
      <template #cell(name)="data">
        <div
          @click="data.toggleDetails()"
          class="pointer"
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
          class="score-cell"
          :id="data.item.id + data.field.key"
          @click="taskClickAction(data)"
        >
          <div
            class="score-value"
            :class="getExtraMarkClass(data.value.score, data.field.score)"
          >
            {{ data.value.score }}
          </div>
        </div>
      </template>
      <template #cell(total)="data">
        <div class="chart" :style="getChartCellStyle(data.value)"></div>
        <div class="value">{{ data.value }}</div>
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
    groupIndex: {
      type: Number,
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
      groups: s => s.groups,
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
      return this.groups[this.groupIndex].students
    },

    tableHeaders() {
      let tableHeaders = [
        {
          label: '#',
          key: 'index',
          thClass: 'font-weight-normal'
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
          thClass: `text-nowrap  align-middle  ${
            t.visible ? '' : ' text-danger'
          }`,
          tdClass: this.isTeacher ? 'hoverable-cell' : 'text-center'
        })
      )

      tableHeaders.push({
        label: `Всего\u00a0(${this.totalScore})`,
        key: 'total',
        tdClass: 'chart-cont border-left  text-center',
        thClass: 'border-left align-middle',
        sortable: true
      })

      return tableHeaders
    },

    tableItems() {
      return this.students.map(student => {
        let row = {
          name: `${student.surname} ${
            !this.isMobile() ? student.name : student.name[0] + '.'
          }`,
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
        groupId: this.groups[this.groupIndex].id
      })
    },

    taskClickAction(data) {
      if (!this.isTeacher) return
      const markData = {
        studentId: data.item.id,
        taskId: data.field.key,
        groupId: this.groups[this.groupIndex].id,
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
  .chart-cont {
    position: relative;
    background: white !important;
    .chart {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      opacity: 0.2;
      z-index: 5;
      transition: width 0.3s;
    }
    .value {
      width: 100%;
      left: 0;
      position: absolute;
      z-index: 10;
    }
  }

  .marks-table {
    width: max-content;
    margin-bottom: 0;

    .hoverable-cell {
      cursor: pointer;
      transition: background-color 0.09s ease-in-out;
      position: relative;
      padding: 0;

      &:hover {
        background-color: #e9ecef !important;
      }

      .score-cell {
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
    font-weight: normal;

    &:hover {
      background-size: 0.65em 1em;
    }
  }
}

@media screen and (max-width: 768px) {
  .marks-table {
    width: 100%;
  }
}
</style>