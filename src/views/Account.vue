<template>
  <b-container>
    <b-row align-h="center">
      <h1 class="m-0">
        Редактирование профиля
      </h1>
    </b-row>
    <b-row align-h="center" class="mb-2">
      <b-col lg="10" xl="9">
        <hr />
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col lg="5" xl="4" class="mb-3">
        <b-card class="p-3  shadow-sm border-0">
          <b-form>
            <b-form-group label="Имя" label-for="name-field">
              <b-form-input
                id="name-field"
                required
                :state="inputState($v.name)"
                v-model.trim="$v.name.$model"
                placeholder="Ваше имя"
              />
            </b-form-group>

            <b-form-group label="Фамилия" label-for="surname-field">
              <b-form-input
                id="surname-field"
                required
                :state="inputState($v.surname)"
                v-model.trim="$v.surname.$model"
                placeholder="Ваша фамилия"
              />
            </b-form-group>

            <btn-loader
              variant="success"
              block
              class="mt-2"
              v-if="!(notChanged || $v.$invalid)"
              @click="updateData"
              load="updateDataBtn"
              or="Сохранить"
            />
          </b-form>
        </b-card>
      </b-col>

      <b-col lg="5" xl="5">
        <auth-data-edit />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import AuthDataEdit from '../components/AuthDataEdit'
import BtnLoader from '../components/BtnLoader'
import baseMixin from '@/mixins/base'

export default {
  components: { AuthDataEdit, BtnLoader },

  mixins: [
    baseMixin({
      name: null,
      surname: null
    }),
  ],

  beforeMount() {
    this.name = this.userData.name
    this.surname = this.userData.surname
  },

  validations: {
    name: { required },
    surname: { required },
  },

  watch: {
    name() {
      if (this.name === this.userData.name)
        this.$v.name.$reset()
    },
    surname() {
      if (this.surname === this.userData.surname)
        this.$v.surname.$reset()
    }
  },

  computed: {
    userData() { return this.$store.getters.userData },

    notChanged() {
      return this.userData.name === this.name && this.userData.surname === this.surname
    }
  },

  methods: {
    updateData() {
      this.$store.dispatch('updateData', {
        name: this.name,
        surname: this.surname
      })
      this.$v.$reset()
    }
  }
}
</script>

<style>
</style>
