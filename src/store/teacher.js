import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { db, storage } from '../main'
import { firestoreAction } from 'vuexfire'

const state = {
  subjects: null
}

const mutations = {}
const getters = {}

const actions = {
  bindSubjects: firestoreAction(({ bindFirestoreRef, rootState }) =>
    bindFirestoreRef(
      'subjects',
      db.collection('subjects').where('teacherId', '==', rootState.user.uid))
  ),

  async addSubject({ rootState }, subj) {
    db.collection('subjects').add({
      name: subj.name,
      course: +subj.course,
      teacherId: rootState.user.uid,
      tasklist: []
    })
  },

  async updateSubject({ commit }, data) {
    commit('setLoading', 'updateSubjectBtn')
    await db.collection('subjects').doc(data.id).update({
      name: data.name,
      course: data.course
    })
    commit('unsetLoading')
  },

  async deleteSubject({ state, commit, dispatch }, id) {
    commit('setLoading', 'deleteSubjectBtn')
    for (let lab of state.subjects.find(s => s.id === id).tasklist)
      await dispatch('deleteLabRab', { subjectId: id, labToDelete: lab })
    await db.collection('subjects').doc(id).delete()
    commit('unsetLoading')
  },

  async addLabRab({ commit }, labData) {
    commit('setLoading', 'btn-addLab')
    let pinnedFiles = []
    for (let file of labData.files) {
      let ref = storage.ref(`lab_files/${Math.random().toString(7)}/${file.name}`)
      await ref.put(file)
      let link = await ref.getDownloadURL()
      pinnedFiles.push({ name: file.name, link, path: ref.fullPath })
    }
    await db.collection('subjects').doc(labData.subjectId).update({
      tasklist: firebase.firestore.FieldValue.arrayUnion({
        name: labData.name,
        number: labData.number,
        description: labData.description,
        score: labData.score,
        files: pinnedFiles
      })
    })
    commit('unsetLoading')
  },

  async deleteLabRab(_, data) {
    for (let file of data.labToDelete.files)
      await storage.ref().child(file.path).delete()
    await db.collection('subjects').doc(data.subjectId).update({
      tasklist: firebase.firestore.FieldValue.arrayRemove(data.labToDelete)
    })
  }
}

export default { state, getters, mutations, actions }