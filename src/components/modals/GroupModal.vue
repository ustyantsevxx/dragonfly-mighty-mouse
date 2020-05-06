<template>
  <b-modal
    centered
    @show="beforeShow"
    :title="`${group ? 'Измен' : 'Добав'}ить группу`"
    id="add-group-modal"
    ref="add-group-modal"
    @hide="resetModal('add-group-modal')"
  >
    <b-form-group label="Название группы">
      <b-input-group>
        <b-input
          :state="inputState($v.newGroupName)"
          v-model.trim="$v.newGroupName.$model"
        />
        <template #append v-if="group">
          <loading-button
            @click="editGroup()"
            :load="loadEdit"
            variant="warning"
            :disabled="newGroupName === group.name || $v.$invalid"
          >
            Обновить
          </loading-button>
        </template>
      </b-input-group>
    </b-form-group>

    <b-row v-if="group" align-h="between">
      <b-col>
        <b-check
          switch
          :checked="group.joinable"
          @change="toggleGroupJoinable($event)"
          class="text-nowrap"
        >
          Открыта для вступления
        </b-check>
      </b-col>
      <b-col cols="12" md="auto">
        <b-link v-if="group.joinable" @click="copyLink()" class="text-nowrap">
          Пригласить студентов
        </b-link>
        <input type="hidden" id="invite-link" />
      </b-col>
    </b-row>

    <template #modal-footer>
      <confirm-btn
        v-if="group"
        @click="deleteGroup()"
        variant="outline-danger"
        class="mr-auto"
        text="Удалить группу"
      />
      <b-btn @click="resetModal('add-group-modal')" variant="light">
        Закрыть
      </b-btn>
      <loading-button
        v-if="!group"
        @click="addGroup()"
        :load="loadAdd"
        variant="success"
        :disabled="$v.$invalid"
      >
        Добавить
      </loading-button>
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import LoadingButton from '@/components/LoadingButton'
import baseMixin from '@/mixins/base'
import ConfirmBtn from '@/components/ConfirmationButton'
import {
  ADD_GROUP,
  UPDATE_GROUP,
  TOGGLE_GROUP_JOINABLE,
  DELETE_GROUP
} from '@/store/actions.type'

export default {
  components: { LoadingButton, ConfirmBtn },

  props: {
    groupId: {
      type: String,
      default: null
    }
  },

  mixins: [
    baseMixin({
      newGroupName: null
    })
  ],

  data: () => ({
    loadAdd: false,
    loadEdit: false
  }),

  watch: {
    newGroupName() {
      if (this.group && this.newGroupName === this.group.name)
        this.$v.newGroupName.$reset()
    }
  },

  computed: {
    group() {
      return this.groupId
        ? this.$store.state.groups.find(g => g.id === this.groupId)
        : null
    }
  },

  methods: {
    async addGroup() {
      this.loadAdd = true
      await this.$store.dispatch(ADD_GROUP, {
        name: this.newGroupName,
        subjectId: this.$route.params.id
      })
      this.resetModal('add-group-modal')
      this.loadAdd = false
    },
    async editGroup() {
      this.loadEdit = true
      await this.$store.dispatch(UPDATE_GROUP, {
        id: this.group.id,
        name: this.newGroupName
      })
      this.newGroupName = this.group.name
      this.$v.$reset()
      this.loadEdit = false
    },
    toggleGroupJoinable(state) {
      this.$store.dispatch(TOGGLE_GROUP_JOINABLE, { id: this.group.id, state })
    },
    async deleteGroup() {
      this.$parent.openedGroupIndex = 0
      await this.$store.dispatch(DELETE_GROUP, this.group.id)
      this.resetModal('add-group-modal')
    },
    beforeShow() {
      if (this.group) {
        this.newGroupName = this.group.name
      }
    },
    copyLink() {
      let a = document.querySelector('#invite-link')
      a.setAttribute('type', 'text')
      a.value = `${location.origin}/join-group/${this.group.id}`
      a.select()
      document.execCommand('copy')
      a.value = ''
      a.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
      this.$store.commit('setToastMsg', {
        msg: 'Ссылка приглашения скопирована!',
        translate: false
      })
    }
  },

  validations: {
    newGroupName: { required }
  }
}
</script>
