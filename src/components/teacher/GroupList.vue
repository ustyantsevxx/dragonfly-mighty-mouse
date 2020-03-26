<template>
  <div>
    <b-row>
      <b-col class="d-flex justify-content-between">
        <h4 class="m-0 text-muted">Группы</h4>
        <b-link v-b-modal.add-group-modal>Добавить группу</b-link>
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col>
        <b-card no-body v-if="groups && groups.length">
          <b-tabs pills card v-model="openedGroupIndex">
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
                <template #cell(name)="data">{{ data.value }}</template>
                <template #cell()="data">
                  <div v-if="data.value">{{data.value}}</div>
                  <div v-else @click="test(data)">-</div>
                </template>
              </b-table>
            </b-tab>
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
      tasks: s => s.teacher.tasks,
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
        tdClass: 'hoverable p-1 text-center',
      }))
      return tableHeaders
    },
    tableItems() {
      return this.groups[this.openedGroupIndex].students.map(t => {
        let item = {
          name: `${t.surname} ${t.name}`,
          id: t.id
        }
        let studentsMarks = this.marks.filter(m => m.student.id === t.id)
        studentsMarks.forEach(m => item[m.task.id] = m.score)
        return item
      })
    }
  },
  beforeCreate() {
    this.$store.dispatch('bindGroup', this.$parent.subj.id)
    this.$store.dispatch('bindMarks', this.$parent.subj.id)
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
      console.log(data)
      //this.$store.dispatch('markTask', data)
    }
  }
}
</script>

<style lang="scss">
.tooltip {
  top: 0 !important;
}

.marks-table {
  width: max-content !important;
}

.hoverable {
  cursor: pointer;
  backdrop-filter: brightness(1);
  transition: backdrop-filter 0.1s ease-in-out;

  &:hover {
    backdrop-filter: brightness(0.95);
  }
}

.table.b-table > thead > tr > [aria-sort="none"] {
  background-size: 0;

  &:hover {
    background-size: 0.65em 1em;
  }
}
</style>