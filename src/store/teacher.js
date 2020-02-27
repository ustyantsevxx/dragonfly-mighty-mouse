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
  async deleteSubject({ state, commit, dispatch }, id) {
    commit('setLoading', 'deleteSubjectBtn')
    for (let lab of state.subjects.find(s => s.id === id).tasklist)
      await dispatch('deleteLabRab', { subjectId: id, labToDelete: lab })

    await firebase.firestore()
      .collection('subjects')
      .doc(id)
      .delete()
    commit('unsetLoading')
  },

  async addLabRab({ dispatch, commit }, labData) {
    commit('setLoading', 'btn-addLab')

    let pinnedFiles = []
    for (let file of labData.files) {
      let ref = firebase.storage().ref(`lab_files/${Math.random().toString(7)}/${file.name}`)
      await ref.put(file)
      let link = await ref.getDownloadURL()
      pinnedFiles.push({ name: file.name, link, path: ref.fullPath })
    }

    await firebase.firestore()
      .collection('subjects')
      .doc(labData.subjectId)
      .update({
        tasklist: firebase.firestore.FieldValue.arrayUnion({
          name: labData.name,
          number: labData.number,
          description: labData.description,
          score: labData.score,
          files: pinnedFiles
        })
      })
    await dispatch('fetch')
    commit('unsetLoading')
  },

  async deleteLabRab({ dispatch }, data) {
    for (let file of data.labToDelete.files)
      await firebase.storage().ref().child(file.path).delete()

    await firebase.firestore()
      .collection('subjects')
      .doc(data.subjectId)
      .update({
        tasklist: firebase.firestore.FieldValue.arrayRemove(data.labToDelete)
      })
    await dispatch('fetch')
  }
}


export default { state, getters, mutations, actions }