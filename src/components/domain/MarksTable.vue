<template>
  <div>
    <b-table
      :fields="tableHeaders"
      :items="tableItems"
      sort-by="name"
      responsive="sm"
      bordered
      v-if="marks && tasks"
      small
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
          <div class="score-value">{{ data.value.score }}</div>
        </div>
      </template>

      <template #cell(total)="data">{{ data.value }}</template>
    </b-table>
    <b-popover :target="popoverTarget" ref="popover">
      <b-button size="sm" variant="danger" @click="deleteMark()">
        Удалить
      </b-button>
    </b-popover>
    <div class="d-none" id="popover-initial"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MARK_TASK, DELETE_MARK } from '@/store/actions.type'

export default {
  props: {
    groupIndex: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    popoverTarget: 'popover-initial',
    selectedMark: null
  }),

  computed: {
    ...mapState({
      groups: s => s.groups,
      marks: s => s.marks,
      tasks: s => s.tasks
    }),

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
          label: `Лаб №${t.number}`,
          key: t.id,
          name: t.name,
          score: t.score,
          sortable: true,
          thClass: `hide-sort-icon text-nowrap ${
            t.visible ? '' : ' text-danger'
          }`,
          tdClass: 'hoverable-cell'
        })
      )

      tableHeaders.push({
        label: 'Всего',
        key: 'total',
        tdClass: 'font-weight-bold text-center',
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
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.$refs.popover.$emit('open')
          })
        })
      } else {
        this.$store.dispatch(MARK_TASK, markData)
      }
    },
    async deleteMark() {
      await this.$store.dispatch(DELETE_MARK, this.selectedMark.id)
      this.$refs.popover.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
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

        .score-value {
          transition: all 1s ease-in-out;
        }
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

@media screen and (max-width: 768px) {
  .marks-table {
    width: 100%;
  }
}
</style>
