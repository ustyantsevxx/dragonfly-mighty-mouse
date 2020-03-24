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
              <div v-for="(student, j) in group.students" :key="j">{{student.surname}}</div>
            </b-tab>
          </b-tabs>
        </b-card>
        <b-card v-else>
          <b-card-text class="text-center text-muted py-4">Список групп пуст.</b-card-text>
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
      newGroupName: null,
      openedGroupIndex: 0
    })
  ],
  computed: {
    groups() {
      return this.$store.state.teacher.groups
    }
  },
  beforeCreate() {
    if (this.$store.state.teacher.groups === null)
      this.$store.dispatch('bindGroup', this.$parent.subj.id)
  },
  methods: {
    async addGroup() {
      await this.$store.dispatch('addGroup', {
        name: this.newGroupName,
        subjectId: this.$parent.subj.id
      })
      this.resetModal('add-group-modal')
    },
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
    }
  },
  validations: {
    newGroupName: { required },
  }
}
</script>