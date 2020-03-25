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
                class="mt-3"
                small
                bordered
                :fields="tableHeaders"
                head-variant="light"
                :items="items"
                sort-by="name"
              >
                <template v-slot:head()="data">
                  <div v-b-tooltip.hover="data.field.name">{{ data.label}}</div>
                </template>

                <template v-for="(t,i) in tableHeaders.slice(1)" #[getslotname(t)]="data">
                  <div v-if="data.value" :key="i">{{data.value}}</div>
                  <div v-else :key="i" @click="test(data)">-</div>
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

export default {
  components: { GroupModal },
  data: () => ({
    openedGroupIndex: 0
  }),
  computed: {
    groups() {
      return this.$store.state.teacher.groups
        ? this.$store.state.teacher.groups
        : []
    },
    getslotname: () => t => {
      return `cell(${t.key})`
    },
    tasks() {
      return this.$store.state.teacher.tasks
        ? this.$store.state.teacher.tasks
        : []
    },
    tableHeaders() {
      let labNumbers = [...this.tasks]
      labNumbers.sort((a, b) => a.number - b.number)
      let a = labNumbers.map(t => ({
        label: `Лаб №${t.number}`,
        key: t.id,
        name: t.name,
        sortable: true
      }))
      a.unshift({ label: 'Фамилия Имя', key: 'name', sortable: true })
      return a
    },
    items() {
      return this.groups[this.openedGroupIndex].students.map(t => {
        if (t.marks) {
          let item = {
            name: `${t.student.surname} ${t.student.name}`,
            id: t.student.id
          }
          t.marks.forEach(m => item[m.task.id] = m.score)
          return item
        }
        else return {}
      })
    }
  },
  beforeCreate() {
    this.$store.dispatch('bindGroup', this.$parent.subj.id)
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
      //this.$store.dispatch('markTask', data)
    }
  }
}
</script>

<style >
.tooltip {
  top: 0 !important;
}
</style>