<template>
  <div>
    <b-table
      :fields="tableHeaders"
      :items="tableItems"
      sort-by="name"
      responsive
      bordered
      v-if="marks && tasks"
      small
      class="mt-3 marks-table"
    >
      <template #head()="data">
        <div v-b-tooltip.hover="data.field.name">{{ data.label }}</div>
      </template>
      <template #cell(index)="data">{{ data.index + 1 }}</template>
      <template #cell()="data">
        <div class="score-cell" @click="test(data)">
          <div class="score-value">{{ data.value }}</div>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MARK_TASK } from '@/store/actions.type'

export default {
  props: {
    groupIndex: {
      type: Number,
      required: true
    }
  },

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
          thClass:
            'hide-sort-icon  text-nowrap' + (t.visible ? '' : ' text-danger'),
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
      return this.groups[this.groupIndex].students.map(t => {
        let row = {
          name: `${t.surname} ${t.name}`,
          id: t.id,
          total: 0
        }
        let studentsMarks = this.marks.filter(m => m.student.id === t.id)
        studentsMarks.forEach(m => {
          row[m.task.id] = m.score
          row.total += m.score
        })
        return row
      })
    }
  },

  methods: {
    test(data) {
      let markData = {
        studentId: data.item.id,
        taskId: data.field.key,
        groupId: this.groups[this.groupIndex].id,
        subjectId: this.$route.params.id,
        score: data.field.score
      }
      this.$store.dispatch(MARK_TASK, markData)
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
