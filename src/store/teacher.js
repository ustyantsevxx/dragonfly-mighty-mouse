import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const state = {
  subjects: null
}

const mutations = {
  assignSubjects(s, data) {
    s.subjects = data
  }
}

const getters = {}

const actions = {
  async fetch({ commit }) {
    let list = await firebase.firestore()
      .collection('subjects')
      .get()
    list = list.docs.map(x => ({ ...x.data(), id: x.id }))
    commit('assignSubjects', list)
  },
  async addSubject({ dispatch }, subj) {
    firebase.firestore()
      .collection('subjects')
      .add({
        name: subj.name,
        course: +subj.course
      })
    dispatch('fetch')
  }
}

export default { state, getters, mutations, actions }