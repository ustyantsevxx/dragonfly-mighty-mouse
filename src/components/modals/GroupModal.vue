<template>
  <b-modal
    centered
    title="Добавить группу"
    id="add-group-modal"
    ref="add-group-modal"
    @hide="resetModal('add-group-modal')"
  >
    <b-form-group label="Код группы">
      <b-form-input :state="inputState($v.newGroupName)" v-model.trim="$v.newGroupName.$model" />
    </b-form-group>

    <template #modal-footer>
      <b-btn @click="resetModal('add-group-modal')" variant="light">Отмена</b-btn>
      <btn-loader
        @click="addGroup"
        load="btn-addGroup"
        or="Добавить"
        variant="success"
        :disabled="$v.$invalid"
      />
    </template>
  </b-modal>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BtnLoader from '@/components/BtnLoader'
import baseMixin from '@/mixins/base'

export default {
  components: { BtnLoader },
  mixins: [
    baseMixin({
      newGroupName: null
    })
  ],
  methods: {
    async addGroup() {
      await this.$store.dispatch('addGroup', {
        name: this.newGroupName,
        subjectId: this.$route.params.id
      })
      this.resetModal('add-group-modal')
    },
  },
  validations: {
    newGroupName: { required },
  }
}
</script>

<style>
</style>