<template>
  <div>
    <b-row>
      <b-col>
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between align-items-center">
            <div>
              <b-nav v-if="!isMobile()" card-header pills>
                <b-nav-item
                  class="hover"
                  :active="openedGroupIndex === i"
                  v-for="(group, i) in groups"
                  :key="i"
                  @click="openedGroupIndex = i"
                >{{group.name}}</b-nav-item>
              </b-nav>
              <b-dd v-else class="m-md-2" variant="primary">
                <template #button-content>{{groups[openedGroupIndex].name}}</template>
                <b-dd-header>Выберите группу</b-dd-header>
                <b-dd-item-btn
                  @click="openedGroupIndex = i"
                  v-for="(group, i) in groups"
                  :key="i"
                >{{group.name}}</b-dd-item-btn>
              </b-dd>
            </div>
            <b-link v-b-modal.add-group-modal>Добавить</b-link>
          </b-card-header>
          <b-card-body v-if="groups && groups.length">
            <b-link @click="copyLink">Пригласить студентов</b-link>
            <input type="hidden" :id="'invite-link-' + openedGroupIndex" />
            <marks-table :group-index="openedGroupIndex" />
          </b-card-body>
          <b-card-text v-else class="text-center text-muted py-4">Список групп пуст.</b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <!-- invisible -->
    <group-modal />
    <!-- /invisible -->
  </div>
</template>

<script>
import { isMobile } from '@/assets/functions'
import MarksTable from '@/components/teacher/MarksTable'
import GroupModal from '@/components/modals/GroupModal'

export default {
  components: { GroupModal, MarksTable },

  data: () => ({
    openedGroupIndex: 0
  }),

  computed: {
    groups() {
      return this.$store.state.teacher.groups
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
    isMobile: () => isMobile()
  }
}
</script>

<style lang="scss" scoped>
.active {
  transition: background-color 0.25s ease-in-out;
}
.hover {
  transition: background-color 0.15s ease-in-out;
  border-radius: 0.25rem;

  &:hover {
    background-color: #e9ecef;
  }
}
</style>