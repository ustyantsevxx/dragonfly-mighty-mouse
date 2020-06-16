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
          <b-card class="shadow-sm border-0">
            <template #header>
              <div class="text-center font-weight-bold">Личные данные</div>
            </template>
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

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { required } from 'vuelidate/lib/validators'
import AuthDataEdit from '@/components/TheAuthDataEdit.vue'
import LoadingButton from '@/components/LoadingButton.vue'
import UserModule from '@/store/user.module'

@Component({
  components: { AuthDataEdit, LoadingButton },
  validations: {
    newName: { required },
    newSurname: { required }
  }
})
export default class extends Vue {
  newName = ''
  newSurname = ''
  loadUpdate = false

  beforeMount() {
    this.newName = this.name
    this.newSurname = this.surname
  }

  get name() {
    return UserModule.name
  }

  get surname() {
    return UserModule.surname
  }

  get notChanged() {
    return this.newName === this.name && this.newSurname === this.surname
  }

  get inputState() {
    return (val: any) => (val.$dirty ? !val.$error : null)
  }

  @Watch('newName')
  onNewNameChange() {
    if (this.newName === this.name) this.$v.newName.$reset()
  }

  @Watch('newSurame')
  onNewSurnameChange() {
    if (this.newSurname === this.surname) this.$v.newSurname.$reset()
  }

  async updateData() {
    this.loadUpdate = true
    await UserModule.UpdateProfile({
      name: this.newName,
      surname: this.newSurname
    })
    this.$v.$reset()
    this.loadUpdate = false
  }

  resetData() {
    this.newName = this.name
    this.newSurname = this.surname
    this.$v.$reset()
  }
}
</script>
