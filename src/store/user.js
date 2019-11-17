import router from '../router'
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

const getters = {
  userData: state => state,
  name: state => state.name,
  surname: state => state.surname,
  email: state => state.email,
  emailVerified: state => state.emailVerified,
  signed: state => state.uid !== null,
}


const mutations = {
  setAuthData(state, user) {
    if (user) {
      state.uid = user.uid
      state.email = user.email
      state.emailVerified = user.emailVerified
    } else {
      state.uid = null
      state.email = null
      state.emailVerififed = null
    }
  },

  setUserData(state, user) {
    if (user) {
      state.name = user.name
      state.surname = user.surname
    } else {
      state.name = null
      state.surname = null
    }
  }
}


const actions = {
  async signUp({
    commit
  }, opt) {
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
      commit('setError', err.message)
      commit('unsetLoading')
    }
  },


  async signIn({
    commit
  }, opt) {
    commit('setLoading', 'loginBtn')

    try {
      await firebase.auth().signInWithEmailAndPassword(opt.email, opt.password)
      return true
    } catch (err) {
      commit('setError', err.message)
      commit('unsetLoading')
    }
  },


  async recoverPassword({
    commit
  }, opt) {
    commit('setLoading', 'restoreBtn')

    try {
      await firebase.auth().sendPasswordResetEmail(opt.email, {
        url: "https://project-scimitar.web.app/login",
      })
      commit('setSuccess', 'Ссылка востановления отправлена.')
      commit('unsetLoading')
      return true
    } catch (err) {
      commit('setError', err.message)
      commit('unsetLoading')
    }
  },


  async signOut() {
    await firebase.auth().signOut()
  },


  async verifyEmail({
    commit
  }) {
    commit('setLoading')

    try {
      await firebase.auth().currentUser.sendEmailVerification()
      commit('setSuccess', 'Ссылка подтверждения отправлена.')
    } catch (err) {
      commit('setError', err.message)
    } finally {
      commit('unsetLoading')
    }
  },


  async updateData({
    commit,
    state
  }, data) {
    try {
      commit('setLoading', 'updateDataBtn')

      await firebase.firestore()
        .collection('users')
        .doc(state.uid)
        .set({
          name: data.name,
          surname: data.surname
        })

      commit('setUserData', data)
      commit('setSuccess', 'Имя успешно изменено.')
    } catch (err) {
      commit('setError', err.message)
    } finally {
      commit('unsetLoading')
    }
  },


  async updateEmail({
    commit,
    state
  }, data) {
    try {
      commit('setLoading', 'updatePassBtn')

      let user = await firebase.auth().signInWithEmailAndPassword(state.email, data.password)
      await firebase.auth().currentUser.updateEmail(data.newEmail)
      await firebase.auth().currentUser.sendEmailVerification()

      commit('setAuthData', user.user)
      commit('setSuccess', 'Запрос на смену эл. почты отправлен.')
      return true
    } catch (err) {
      commit('setError', err.message)
    } finally {
      commit('unsetLoading')
    }
  },


  async updatePassword({
    commit,
    state
  }, passwords) {
    try {
      commit('setLoading', 'updatePassBtn')

      let user = await firebase.auth().signInWithEmailAndPassword(state.email, passwords.old)
      await firebase.auth().currentUser.updatePassword(passwords.new)

      commit('setAuthData', user.user)
      commit('setSuccess', 'Пароль успешно изменен.')
      return true
    } catch (err) {
      commit('setError', err.message)
    } finally {
      commit('unsetLoading')
    }
  }
}



export default {
  state,
  getters,
  mutations,
  actions
}