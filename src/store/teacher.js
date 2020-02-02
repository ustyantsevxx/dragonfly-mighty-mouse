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
  async fetch({ commit, rootState }) {
    let list = await firebase.firestore()
      .collection('subjects')
      .get()
    list = list.docs
      .map(x => ({ ...x.data(), id: x.id }))
      .filter(x => x.teacherId === rootState.user.uid)
    commit('assignSubjects', list)
  },

  async addSubject({ dispatch, rootState }, subj) {
    firebase.firestore()
      .collection('subjects')
      .add({
        name: subj.name,
        course: +subj.course,
        teacherId: rootState.user.uid
      })
    await dispatch('fetch')
  },
  async updateSubject({ dispatch, commit }, data) {
    commit('setLoading', 'updateSubjectBtn')

    await firebase.firestore()
      .collection('subjects')
      .doc(data.id)
      .update({ name: data.name, course: data.course })
    await dispatch('fetch')
    commit('unsetLoading')

  },
  async deleteSubject({ commit }, id) {
    commit('setLoading', 'deleteSubjectBtn')
    await firebase.firestore()
      .collection('subjects')
      .doc(id)
      .delete()
    commit('unsetLoading')
  }
}


export default { state, getters, mutations, actions }