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
              <btn-loader
                variant="success"
                block
                @click="updateData"
                load="btn__updateData"
                or="Сохранить"
              />
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
import AuthDataEdit from '../components/AuthDataEdit'
import BtnLoader from '../components/BtnLoader'
import baseMixin from '@/mixins/base'
import { UPDATE_PROFILE } from '@/store/actions.type'

export default {
  components: { AuthDataEdit, BtnLoader },

  mixins: [
    baseMixin({
      newName: null,
      newSurname: null
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
    updateData() {
      this.$store.dispatch(UPDATE_PROFILE, {
        name: this.newName,
        surname: this.newSurname
      })
      this.$v.$reset()
    }
  },

  validations: {
    newName: { required },
    newSurname: { required }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1080px) {
  .header {
    font-size: 1.5rem;
  }
}
</style>
