import store from './index'
import firebase from 'firebase/app'
import { db, auth } from '@/main'
import {
  LOGIN,
  LOGIN_WITH_GOOGLE,
  LOGOUT,
  REGISTER,
  RESTORE_PASSWORD,
  VERIFY_EMAIL,
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PROFILE
} from './actions.type'

const state = {
  uid: null,
  email: null,
  emailVerified: null,
  name: null,
  surname: null,
  isTeacher: null
}

const mutations = {
  setAuthData(state, user) {
    state.uid = user?.uid
    state.email = user?.email
    state.emailVerified = user?.emailVerified
  },
  setUserData(state, user) {
    state.name = user?.name
    state.surname = user?.surname
    state.isTeacher = user?.isTeacher
  }
}

const tryDoOrToastError = async fn => {
  try {
    await fn()
    return true
  } catch (e) {
    store.commit('setToastMsg', {
      error: true,
      msg: e.message,
      translate: true
    })
  }
}

const actions = {
  [LOGIN](_, opt) {
    return tryDoOrToastError(async () => {
      await auth.signInWithEmailAndPassword(opt.email, opt.password)
    })
  },

  // [REGISTER](_, opt) {
  //   return tryDoOrToastError(async () => {
  //     let creds = await auth.createUserWithEmailAndPassword(
  //       opt.email,
  //       opt.password
  //     )
  //     await db.collection('users').doc(creds.user.uid).set({
  //       name: opt.name,
  //       surname: opt.surname,
  //       email: opt.email,
  //       isTeacher: opt.isTeacher
  //     })
  //   })
  // },

  // [LOGIN_WITH_GOOGLE]() {
  //   return tryDoOrToastError(async () => {
  //     let googleProvider = new firebase.auth.GoogleAuthProvider()
  //     await auth.signInWithPopup(googleProvider)
  //   })
  // },

  [LOGOUT]() {
    location.reload()
    auth.signOut()
  }

  // [RESTORE_PASSWORD]({ commit }, opt) {
  //   return tryDoOrToastError(async () => {
  //     await auth.sendPasswordResetEmail(opt.email, {
  //       url: 'https://project-scimitar.web.app/login'
  //     })
  //     commit('setToastMsg', { msg: 'Ссылка востановления отправлена' })
  //   })
  // },

  // [VERIFY_EMAIL]({ commit }) {
  //   return tryDoOrToastError(async () => {
  //     await auth.currentUser.sendEmailVerification()
  //     commit('setToastMsg', { msg: 'Ссылка подтверждения отправлена' })
  //   })
  // },

  // [UPDATE_PROFILE]({ commit, state }, data) {
  //   return tryDoOrToastError(async () => {
  //     let userDoc = db.collection('users').doc(state.uid)
  //     await userDoc.update({
  //       name: data.name,
  //       surname: data.surname
  //     })
  //     let fetchedData = await userDoc.get()
  //     commit('setUserData', fetchedData.data())
  //     commit('setToastMsg', { msg: 'Имя успешно изменено' })
  //   })
  // },

  // [UPDATE_EMAIL]({ commit, state }, data) {
  //   return tryDoOrToastError(async () => {
  //     let user = await auth.signInWithEmailAndPassword(
  //       state.email,
  //       data.password
  //     )
  //     await auth.currentUser.updateEmail(data.newEmail)
  //     await db.collection('users').doc(auth.currentUser.uid).update({
  //       email: data.newEmail
  //     })
  //     await auth.currentUser.sendEmailVerification()
  //     commit('setAuthData', user.user)
  //     commit('setToastMsg', { msg: 'Запрос на смену эл. почты отправлен' })
  //   })
  // },

  // [UPDATE_PASSWORD]({ commit, state }, passwords) {
  //   return tryDoOrToastError(async () => {
  //     let user = await auth.signInWithEmailAndPassword(
  //       state.email,
  //       passwords.old
  //     )
  //     await auth.currentUser.updatePassword(passwords.new)
  //     commit('setAuthData', user.user)
  //     commit('setToastMsg', { msg: 'Пароль успешно изменен' })
  //   })
  // }
}

export default { state, mutations, actions }
