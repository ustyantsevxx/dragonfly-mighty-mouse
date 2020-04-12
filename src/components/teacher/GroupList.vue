<template>
  <div>
    <b-row>
      <b-col>
        <b-card no-body v-if="groups && groups.length">
          <b-tabs vertical pills card v-model="openedGroupIndex">
            <b-tab :title="group.name" v-for="(group, i) in groups" :key="i">
              <b-link @click="copyLink">Пригласить студентов</b-link>
              <input type="hidden" :id="'invite-link-' + i" />
              <b-table
                :fields="tableHeaders"
                :items="tableItems"
                sort-by="name"
                striped
                head-variant="light"
                v-if="marks && tasks"
                bordered
                small
                class="mt-3 marks-table"
              >
                <template #head()="data">
                  <div v-b-tooltip.hover="data.field.name">{{ data.label }}</div>
                </template>
                <template #cell(index)="data">{{ data.index + 1 }}</template>
                <template #cell()="data">
                  <div class="score-cell" @click="test(data)">
                    <div class="score-value">{{data.value}}</div>
                  </div>
                </template>
              </b-table>
            </b-tab>
            <template v-slot:tabs-end>
              <b-nav-item v-b-modal.add-group-modal class="text-center">
                <b-icon icon="plus" />
              </b-nav-item>
            </template>
          </b-tabs>
        </b-card>
        <b-card v-else>
          <b-card-text class="text-center text-muted py-4">Список групп пуст.</b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <!-- invisible -->
    <group-modal />
    <!-- /invisible -->
  </div>
</template>

<script>
import GroupModal from '@/components/modals/GroupModal'
import { mapState } from 'vuex'

export default {
  components: { GroupModal },

  data: () => ({
    openedGroupIndex: 0
  }),

  computed: {
    ...mapState({
      groups: s => s.teacher.groups,
      marks: s => s.teacher.marks,
      tasks: s => s.teacher.tasks
    }),

    tableHeaders() {
      let tableHeaders = [{
        label: '#',
        key: 'index'
      }, {
        label: 'Фамилия Имя',
        key: 'name',
        tdClass: 'font-weight-bold',
        stickyColumn: true,
        sortable: true
      }]

      let labNumbers = [...this.tasks].sort((a, b) => a.number - b.number)
      labNumbers.forEach(t => tableHeaders.push({
        label: `Лаб №${t.number}`,
        key: t.id,
        name: t.name,
        score: t.score,
        sortable: true,
        thClass: 'hide-sort-icon' + (t.visible ? '' : ' text-danger'),
        tdClass: 'hoverable-cell'
      }))

      tableHeaders.push({
        label: 'Всего',
        key: 'total',
        tdClass: 'font-weight-bold text-center',
        sortable: true
      })

      return tableHeaders
    },

    tableItems() {
      return this.groups[this.openedGroupIndex].students.map(t => {
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
    copyLink() {
      let a = document.querySelector('#invite-link-' + this.openedGroupIndex)
      a.setAttribute('type', 'text')
      a.value = `${location.origin}/join-group/${this.groups[this.openedGroupIndex].id}`
      a.select()
      document.execCommand('copy')
      a.value = ''
      a.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
      this.$store.commit('setToastMsg', { msg: 'Ссылка приглашения скопирована!', translate: false })
    },
    test(data) {
      let markData = {
        studentId: data.item.id,
        taskId: data.field.key,
        groupId: this.groups[this.openedGroupIndex].id,
        subjectId: this.$route.params.id,
        score: data.field.score
      }
      this.$store.dispatch('markTask', markData)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .marks-table {
    width: max-content !important;

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

  .table.b-table > thead > tr > [aria-sort="none"] {
    background-size: 0;

    &:hover {
      background-size: 0.65em 1em;
    }
  }
}
</style>