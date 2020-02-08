import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const state = {
  uid: null,
  email: null,
  emailVerified: null,
  name: null,
  surname: null
}

const getters = {}

const mutations = {
  setAuthData(state, user) {
    state.uid = user ? user.uid : null
    state.email = user ? user.email : null
    state.emailVerified = user ? user.emailVerified : null
  },
  setUserData(state, user) {
    state.name = user ? user.name : null
    state.surname = user ? user.surname : null
  }
}

const actions = {
  async signUp({ commit }, opt) {
    commit('setLoading', 'registerBtn')
    try {
      let creds = await firebase.auth().createUserWithEmailAndPassword(opt.email, opt.password)
      firebase.firestore()
        .collection('users')
        .doc(creds.user.uid)
        .set({
          name: opt.name,
          surname: opt.surname
        })
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
    }
    commit('unsetLoading')
  },

  async signIn({ commit }, opt) {
    commit('setLoading', 'loginBtn')
    try {
      await firebase.auth().signInWithEmailAndPassword(opt.email, opt.password)
      return true
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
      commit('unsetLoading')
    }
  },

  async googleSignIn({ commit }) {
    commit('setLoading', 'btn-googleSign')
    try {
      let googleProvider = new firebase.auth.GoogleAuthProvider()
      await firebase.auth().signInWithPopup(googleProvider)
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
      commit('unsetLoading')
    }
  },

  async recoverPassword({ commit }, opt) {
    commit('setLoading', 'restoreBtn')
    try {
      await firebase.auth().sendPasswordResetEmail(opt.email, {
        url: 'https://project-scimitar.web.app/login',
      })
      commit('setToastMsg', { msg: 'Ссылка востановления отправлена' })
      commit('unsetLoading')
      return true
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
      commit('unsetLoading')
    }
  },

  async signOut() {
    await firebase.auth().signOut()
    location.replace('/')
  },

  async verifyEmail({ commit }) {
    commit('setLoading')
    try {
      await firebase.auth().currentUser.sendEmailVerification()
      commit('setToastMsg', { msg: 'Ссылка подтверждения отправлена' })
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
    }
    commit('unsetLoading')
  },

  async updateData({ commit, state }, data) {
    commit('setLoading', 'updateDataBtn')
    try {
      await firebase.firestore()
        .collection('users')
        .doc(state.uid)
        .set({
          name: data.name,
          surname: data.surname
        })
      commit('setUserData', data)
      commit('setToastMsg', { msg: 'Имя успешно изменено' })
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
    }
    commit('unsetLoading')
  },

  async updateEmail({ commit, state }, data) {
    commit('setLoading', 'updatePassBtn')
    try {
      let user = await firebase.auth().signInWithEmailAndPassword(state.email, data.password)
      await firebase.auth().currentUser.updateEmail(data.newEmail)
      await firebase.auth().currentUser.sendEmailVerification()
      commit('setAuthData', user.user)
      commit('setToastMsg', { msg: 'Запрос на смену эл. почты отправлен' })
      return true
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
    } finally {
      commit('unsetLoading')
    }
  },

  async updatePassword({ commit, state }, passwords) {
    commit('setLoading', 'updatePassBtn')
    try {
      let user = await firebase.auth().signInWithEmailAndPassword(state.email, passwords.old)
      await firebase.auth().currentUser.updatePassword(passwords.new)
      commit('setAuthData', user.user)
      commit('setToastMsg', { msg: 'Пароль успешно изменен' })
      return true
    } catch (err) {
      commit('setToastMsg', { error: true, msg: err.message })
    } finally {
      commit('unsetLoading')
    }
  }
}


export default { state, getters, mutations, actions }