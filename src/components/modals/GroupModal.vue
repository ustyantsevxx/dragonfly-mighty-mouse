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
      <b-form-input
        :state="inputState($v.newGroupName)"
        v-model.trim="$v.newGroupName.$model"
      />
    </b-form-group>

    <template #modal-footer>
      <confirm-btn
        v-if="group"
        @click="deleteGroup"
        variant="outline-danger"
        class="mr-auto"
        text="Удалить группу"
      />
      <b-btn @click="resetModal('add-group-modal')" variant="light">
        Отмена
      </b-btn>
      <btn-loader
        @click="group ? editGroup() : addGroup()"
        load="btn-addGroup"
        :or="group ? 'Обновить' : 'Добавить'"
        :variant="group ? 'warning' : 'success'"
        :disabled="$v.$invalid"
      />
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import baseMixin from '@/mixins/base'
import ConfirmBtn from '@/components/ConfirmationButton'
import { ADD_GROUP, UPDATE_GROUP, DELETE_GROUP } from '@/store/actions.type'

export default {
  components: { BtnLoader, ConfirmBtn },

  props: ['group'],

  mixins: [
    baseMixin({
      newGroupName: null
    })
  ],

  methods: {
    async addGroup() {
      this.$store.dispatch(ADD_GROUP, {
        name: this.newGroupName,
        subjectId: this.$route.params.id
      })
      this.resetModal('add-group-modal')
    },
    async editGroup() {
      this.$store.dispatch(UPDATE_GROUP, {
        id: this.group.id,
        name: this.newGroupName
      })
      this.resetModal('add-group-modal')
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
    }
  },

  validations: {
    newGroupName: { required }
  }
}
</script>
