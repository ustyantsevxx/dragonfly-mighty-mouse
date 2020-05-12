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
                <b-nav
                  v-if="groups.length < 7 && !isMobile()"
                  card-header
                  pills
                >
                  <b-nav-item
                    class="app__hover"
                    :active="selectedGroupId === group.id"
                    active-class="app__selected_group"
                    v-for="(group, i) in groups"
                    :key="i"
                    @click="selectedGroupId = group.id"
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
                    @click="selectedGroupId = group.id"
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

          <b-card-body v-if="groups && groups.length && selectedGroupId">
            <h2 class="app__group_name">
              <template v-if="!isTeacher">
                Ведомость группы {{ selectedGroup.name }}
              </template>
              <div
                v-else
                class="g__pointer"
                @click="openModal(true)"
                title="Редактировать группу"
              >
                {{ selectedGroup.name }}
                <b-icon v-if="isTeacher" icon="pencil" class="g__hover_icon" />
              </div>
            </h2>
            <marks-table :group-id="selectedGroup.id" />
          </b-card-body>

          <b-card-text
            v-else-if="!groups.length"
            class="text-center text-muted py-4"
          >
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
    selectedGroupId: null
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
      return this.groups.find(g => g.id === this.selectedGroupId)
    }
  },

  watch: {
    groups: {
      handler: 'selectFirst',
      immediate: true
    }
  },

  methods: {
    openModal(create = false) {
      this.groupToEdit = create ? this.selectedGroup.id : null
      this.$nextTick(() => this.$bvModal.show('add-group-modal'))
    },
    selectFirst(force) {
      if (force === true || (!this.selectedGroupId && this.groups.length))
        this.selectedGroupId = this.groups[0].id
    }
  }
}
</script>

<style lang="scss" scoped>
.app__selected_group {
  transition: background-color 0.25s ease-in-out;
}

.app__hover {
  transition: background-color 0.15s ease-in-out;
  border-radius: 0.25rem;

  &:hover {
    background-color: $light;
  }
}

.app__group_name {
  width: max-content;
  margin-bottom: 0;

  &:hover {
    .g__hover_icon {
      opacity: 0.1;
    }
  }
}
</style>
