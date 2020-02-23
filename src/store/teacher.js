import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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
      .where('teacherId', '==', rootState.user.uid)
      .get()
    list = list.docs
      .map(x => ({ ...x.data(), id: x.id }))
    commit('assignSubjects', list)
  },

  async addSubject({ dispatch, rootState }, subj) {
    firebase.firestore()
      .collection('subjects')
      .add({
        name: subj.name,
        course: +subj.course,
        teacherId: rootState.user.uid,
        tasklist: []
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
  },

  async addLabRab({ dispatch, commit }, labData) {
    commit('setLoading', 'btn-addLab')
    await firebase.firestore()
      .collection('subjects')
      .doc(labData.subjectId)
      .update({
        tasklist: firebase.firestore.FieldValue.arrayUnion({
          name: labData.name,
          number: labData.number,
          description: labData.description,
          score: labData.score
        })
      })
    await dispatch('fetch')
    commit('unsetLoading')
  },
  async deleteLabRab({ dispatch }, data) {
    await firebase.firestore()
      .collection('subjects')
      .doc(data.subjectId)
      .update({
        tasklist: firebase.firestore.FieldValue.arrayRemove(data.labToDelete)
      })
    await dispatch('fetch')
  },
  async uploadFile(_, file) {
    let ref = firebase.storage().ref(`lab_files/${file.name}`)
    await ref.put(file)
    let url = await ref.getDownloadURL()
    console.log(url)
  }
}


export default { state, getters, mutations, actions }