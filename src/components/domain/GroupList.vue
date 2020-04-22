<template>
  <div>
    <b-row>
      <b-col>
        <b-card no-body class="shadow-sm border-0">
          <b-card-header
            class="d-flex bg-white justify-content-between align-items-center"
          >
            <div>
              <div v-if="groups && groups.length">
                <b-nav v-if="!isMobile()" card-header pills>
                  <b-nav-item
                    class="hover"
                    :active="openedGroupIndex === i"
                    v-for="(group, i) in groups"
                    :key="i"
                    @click="openedGroupIndex = i"
                  >
                    {{ group.name }}
                  </b-nav-item>
                </b-nav>
                <b-dd v-else class="m-md-2" variant="primary">
                  <template #button-content>
                    {{ selectedGroup.name }}
                  </template>
                  <b-dd-header>Выберите группу</b-dd-header>
                  <b-dd-item-btn
                    @click="openedGroupIndex = i"
                    v-for="(group, i) in groups"
                    :key="i"
                  >
                    {{ group.name }}
                  </b-dd-item-btn>
                </b-dd>
              </div>
            </div>
            <b-link @click.prevent="openModal()">Добавить</b-link>
          </b-card-header>
          <b-card-body v-if="groups && groups.length">
            <h2 class="group-name">
              {{ selectedGroup.name }}
              <b-icon
                v-if="isTeacher"
                icon="pencil"
                @click="openModal(true)"
                class="hover-icon"
                title="Редактировать"
              />
            </h2>
            <template v-if="isTeacher">
              <b-link @click="copyLink">Пригласить студентов</b-link>
              <input type="hidden" :id="'invite-link-' + openedGroupIndex" />
            </template>
            <marks-table :group-index="openedGroupIndex" />
          </b-card-body>
          <b-card-text v-else class="text-center text-muted py-4">
            Список групп пуст.
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <!-- invisible -->
    <group-modal :group="groupToEdit" />
    <!-- /invisible -->
  </div>
</template>

<script>
import { isMobile } from '@/assets/functions'
import MarksTable from '@/components/domain/MarksTable'
import GroupModal from '@/components/modals/GroupModal'

export default {
  components: { GroupModal, MarksTable },

  data: () => ({
    groupToEdit: null,
    openedGroupIndex: 0
  }),

  computed: {
    isTeacher() {
      return this.$store.state.user.isTeacher
    },
    groups() {
      return this.$store.state.groups
    },
    selectedGroup() {
      return this.groups[this.openedGroupIndex]
    }
  },

  methods: {
    copyLink() {
      let a = document.querySelector('#invite-link-' + this.openedGroupIndex)
      a.setAttribute('type', 'text')
      a.value = `${location.origin}/join-group/${
        this.groups[this.openedGroupIndex].id
      }`
      a.select()
      document.execCommand('copy')
      a.value = ''
      a.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
      this.$store.commit('setToastMsg', {
        msg: 'Ссылка приглашения скопирована!',
        translate: false
      })
    },
    isMobile: () => isMobile(),
    openModal(create = false) {
      this.groupToEdit = create ? this.selectedGroup : null
      this.$nextTick(() => {
        this.$bvModal.show('add-group-modal')
      })
    }
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

.group-name {
  margin-bottom: 0;
  &:hover {
    .hover-icon {
      opacity: 0.1;
    }
  }
}
</style>
