import firebase from 'firebase/app'
import { User } from '@/models'
import { db, auth } from '@/main'
import store from '@/store'
import {
  VuexModule,
  Module,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'

export interface IUserState {
  uid: string
  name: string
  surname: string
  email: string
  isTeacher: boolean
  emailVerified: boolean
}

@Module({ dynamic: true, store, name: 'user' })
class UserModule extends VuexModule {
  uid: string | undefined | null = null
  name: string | undefined | null = null
  surname: string | undefined | null = null
  email: string | undefined | null = null
  isTeacher: boolean | undefined | null = null
  emailVerified: boolean | undefined | null = null

  @Mutation
  SetUserData(user: User) {
    this.uid = user.uid
    this.name = user.name
    this.surname = user.surname
    this.email = user.email
    this.isTeacher = user.isTeacher
    this.emailVerified = user.emailVerified
  }

  @Action
  async Login(options: { email: string; password: string }): Promise<boolean> {
    try {
      await auth.signInWithEmailAndPassword(options.email, options.password)
      return true
    } catch (e) {
      this.context.commit('setToastMsg', {
        error: true,
        msg: e.message,
        translate: true
      })
      return false
    }
  }

  @Action
  Logout(): void {
    location.reload()
    auth.signOut()
  }
}

export default getModule(UserModule)

// const actions = {
//

//   // [REGISTER](_, opt) {
//   //   return tryDoOrToastError(async () => {
//   //     let creds = await auth.createUserWithEmailAndPassword(
//   //       opt.email,
//   //       opt.password
//   //     )
//   //     await db.collection('users').doc(creds.user.uid).set({
//   //       name: opt.name,
//   //       surname: opt.surname,
//   //       email: opt.email,
//   //       isTeacher: opt.isTeacher
//   //     })
//   //   })
//   // },

//   // [LOGIN_WITH_GOOGLE]() {
//   //   return tryDoOrToastError(async () => {
//   //     let googleProvider = new firebase.auth.GoogleAuthProvider()
//   //     await auth.signInWithPopup(googleProvider)
//   //   })
//   // },

//

//   // [RESTORE_PASSWORD]({ commit }, opt) {
//   //   return tryDoOrToastError(async () => {
//   //     await auth.sendPasswordResetEmail(opt.email, {
//   //       url: 'https://project-scimitar.web.app/login'
//   //     })
//   //     commit('setToastMsg', { msg: 'Ссылка востановления отправлена' })
//   //   })
//   // },

//   // [VERIFY_EMAIL]({ commit }) {
//   //   return tryDoOrToastError(async () => {
//   //     await auth.currentUser.sendEmailVerification()
//   //     commit('setToastMsg', { msg: 'Ссылка подтверждения отправлена' })
//   //   })
//   // },

//   // [UPDATE_PROFILE]({ commit, state }, data) {
//   //   return tryDoOrToastError(async () => {
//   //     let userDoc = db.collection('users').doc(state.uid)
//   //     await userDoc.update({
//   //       name: data.name,
//   //       surname: data.surname
//   //     })
//   //     let fetchedData = await userDoc.get()
//   //     commit('setUserData', fetchedData.data())
//   //     commit('setToastMsg', { msg: 'Имя успешно изменено' })
//   //   })
//   // },

//   // [UPDATE_EMAIL]({ commit, state }, data) {
//   //   return tryDoOrToastError(async () => {
//   //     let user = await auth.signInWithEmailAndPassword(
//   //       state.email,
//   //       data.password
//   //     )
//   //     await auth.currentUser.updateEmail(data.newEmail)
//   //     await db.collection('users').doc(auth.currentUser.uid).update({
//   //       email: data.newEmail
//   //     })
//   //     await auth.currentUser.sendEmailVerification()
//   //     commit('setAuthData', user.user)
//   //     commit('setToastMsg', { msg: 'Запрос на смену эл. почты отправлен' })
//   //   })
//   // },

//   // [UPDATE_PASSWORD]({ commit, state }, passwords) {
//   //   return tryDoOrToastError(async () => {
//   //     let user = await auth.signInWithEmailAndPassword(
//   //       state.email,
//   //       passwords.old
//   //     )
//   //     await auth.currentUser.updatePassword(passwords.new)
//   //     commit('setAuthData', user.user)
//   //     commit('setToastMsg', { msg: 'Пароль успешно изменен' })
//   //   })
//   // }
// }

// export default { state, getters, mutations, actions }
