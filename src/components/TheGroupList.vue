<template>
  <div class="mb-5">
    <b-row>
      <b-col>
        <b-card no-body class="shadow-sm border-0">
          <b-card-header
            v-if="isTeacher"
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
              <template v-if="!isTeacher">
                Ведомость группы {{ selectedGroup.name }}
              </template>
              <div
                v-else
                class="pointer"
                @click="openModal(true)"
                title="Редактировать группу"
              >
                {{ selectedGroup.name }}
                <b-icon v-if="isTeacher" icon="pencil" class="hover-icon" />
              </div>
            </h2>
            <marks-table :group-index="openedGroupIndex" />
          </b-card-body>
          <b-card-text v-else class="text-center text-muted py-4">
            Список групп пуст.
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>

    <!-- invisible -->
    <group-modal :group-id="groupToEdit" />
    <!-- /invisible -->
  </div>
</template>

<script>
import MarksTable from '@/components/TheMarksTable'
import GroupModal from '@/components/GroupModal'

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
      return [...this.$store.state.groups].sort((a, b) =>
        a.name.replace(' ', '').localeCompare(b.name.replace(' ', ''))
      )
    },
    selectedGroup() {
      return this.groups[this.openedGroupIndex]
    }
  },

  methods: {
    openModal(create = false) {
      this.groupToEdit = create ? this.selectedGroup.id : null
      this.$nextTick(() => this.$bvModal.show('add-group-modal'))
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
  width: max-content;
  margin-bottom: 0;
  &:hover {
    .hover-icon {
      opacity: 0.1;
    }
  }
}
</style>
