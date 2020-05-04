<template>
  <div>
    <b-table
      :fields="tableHeaders"
      :items="tableItems"
      sort-by="name"
      responsive="sm"
      striped
      bordered
      v-if="marks && tasks"
      small
      @sort-changed="closePopover"
      class="mt-3 marks-table"
    >
      <template #head()="data">
        <div v-b-tooltip.hover="data.field.name">{{ data.label }}</div>
      </template>
      <template #cell(index)="data">{{ data.index + 1 }}</template>
      <template #cell(name)="data">{{ data.value }}</template>

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
        <div
          class="chart"
          :style="{
            width: widthOfTotalCell(data.value) + '%',
            background: percentageToColor(widthOfTotalCell(data.value))
          }"
        ></div>
        <div class="value">{{ data.value }}</div>
      </template>
    </b-table>

    <b-check v-model="showOnlyVisible">
      Показать только открытые
    </b-check>

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
</template>

<script>
import { mapState } from 'vuex'
import { MARK_TASK, UPDATE_MARK, DELETE_MARK } from '@/store/actions.type'
import { debounce } from 'debounce'
import { scale } from 'chroma-js'

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
    showOnlyVisible: true
  }),

  computed: {
    ...mapState({
      groups: s => s.groups,
      marks: s => s.marks,
      tasks(s) {
        return !this.showOnlyVisible
          ? s.tasks
          : s.tasks.filter(task => task.visible)
      },
      isTeacher: s => s.user.isTeacher
    }),

    totalScore() {
      return this.tasks.reduce((t, c) => t + c.score, 0)
    },

    tableHeaders() {
      let tableHeaders = [
        {
          label: '',
          key: 'index'
        },
        {
          label: 'Фамилия Имя',
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
          thClass: `text-nowrap ${t.visible ? '' : ' text-danger'}`,
          tdClass: this.isTeacher ? 'hoverable-cell' : 'text-center'
        })
      )

      tableHeaders.push({
        label: `Всего\u00A0(${this.totalScore})`,
        key: 'total',
        tdClass: 'chart-cont border-left text-center',
        thClass: 'border-left',
        sortable: true
      })

      return tableHeaders
    },

    tableItems() {
      return this.groups[this.groupIndex].students.map(student => {
        let row = {
          name: `${student.surname} ${student.name}`,
          id: student.id,
          total: 0
        }
        let studentsMarks = this.marks.filter(m => m.student.id === student.id)
        studentsMarks.forEach(mark => {
          row[mark.task.id] = {
            id: mark.id,
            score: mark.score
          }
          row.total += mark.score
        })
        return row
      })
    }
  },

  methods: {
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
        this.$refs.popover.$emit('close')
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
      this.$refs.popover.$emit('close')
    },
    closePopover() {
      this.$refs.popover.$emit('close')
    },
    getExtraMarkClass(actual, taskScore) {
      if (actual > taskScore) return 'font-weight-bold text-success'
      if (actual < taskScore) return 'font-weight-bold text-danger'
      return ''
    },
    widthOfTotalCell(value) {
      if (value >= this.totalScore) return 100
      return (value / this.totalScore) * 100
    },
    percentageToColor(perc) {
      if (perc === 100) return 'green'
      return scale(['#dc3545', '#ffc107', '#28a745'])(perc / 100)
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
