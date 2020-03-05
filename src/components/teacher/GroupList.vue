<template>
  <div>
    <b-row>
      <b-col class="d-flex justify-content-between">
        <h4 class="m-0 text-muted">Группы</h4>
        <b-link v-b-modal.add-group-modal size="sm" variant="dark">Добавить группу</b-link>
      </b-col>
    </b-row>

    <b-row class="mt-2" v-if="groups">
      <b-col>
        <b-card no-body>
          <b-tabs pills card>
            <b-tab :title="group.name" v-for="(group, i) in groups" :key="i">
              <b-card-text>{{group.name}}</b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>

    <b-modal
      centered
      no-close-on-backdrop
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
  </div>
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
  computed: {
    groups() {
      return this.$store.state.teacher.groups ?? null
    }
  },
  beforeCreate() {
    this.$store.dispatch('bindGroup', this.$parent.subj.id)
  },
  methods: {
    async addGroup() {
      await this.$store.dispatch('addGroup', {
        name: this.newGroupName,
        subjectId: this.$parent.subj.id
      })
      this.resetModal('add-group-modal')
    }
  },
  validations: {
    newGroupName: { required },
  }
}
</script>

<style>
</style>