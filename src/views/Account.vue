<template>
  <main>
    <b-container>
      <b-row align-h="center">
        <h1 class="header m-0">Редактирование профиля</h1>
      </b-row>
      <b-row align-h="center" class="mb-2">
        <b-col lg="10" xl="9">
          <hr />
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col lg="5" xl="4" class="mb-3">
          <b-card class="shadow-sm border-0" header="Личные данные">
            <b-form>
              <b-form-group label="Имя">
                <b-form-input
                  required
                  :state="inputState($v.newName)"
                  v-model.trim="$v.newName.$model"
                  placeholder="Ваше имя"
                />
              </b-form-group>

              <b-form-group label="Фамилия">
                <b-form-input
                  required
                  :state="inputState($v.newSurname)"
                  v-model.trim="$v.newSurname.$model"
                  placeholder="Ваша фамилия"
                />
              </b-form-group>
            </b-form>
            <template #footer v-if="!(notChanged || $v.$invalid)">
              <loading-button
                variant="success"
                block
                @click="updateData"
                :load="loadUpdate"
              >
                Сохранить
              </loading-button>
            </template>
          </b-card>
        </b-col>

        <b-col lg="5" xl="5">
          <auth-data-edit />
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import AuthDataEdit from '@/components/TheAuthDataEdit'
import LoadingButton from '@/components/LoadingButton'
import modalMixin from '@/mixins/modal'
import { UPDATE_PROFILE } from '@/store/actions.type'

export default {
  components: { AuthDataEdit, LoadingButton },

  mixins: [
    modalMixin({
      newName: null,
      newSurname: null,
      loadUpdate: false
    })
  ],

  computed: {
    name() {
      return this.$store.state.user.name
    },
    surname() {
      return this.$store.state.user.surname
    },
    notChanged() {
      return this.newName === this.name && this.newSurname === this.surname
    }
  },

  watch: {
    newName() {
      if (this.newName === this.name) this.$v.newName.$reset()
    },
    newSurname() {
      if (this.newSurname === this.surname) this.$v.newSurname.$reset()
    }
  },

  beforeMount() {
    this.newName = this.name
    this.newSurname = this.surname
  },

  methods: {
    async updateData() {
      this.loadUpdate = true
      await this.$store.dispatch(UPDATE_PROFILE, {
        name: this.newName,
        surname: this.newSurname
      })
      this.$v.$reset()
      this.loadUpdate = false
    }
  },

  validations: {
    newName: { required },
    newSurname: { required }
  }
}
</script>
