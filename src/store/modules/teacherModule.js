import firebase from 'firebase/app'
import { db, storage } from '../../main'
import { firestoreAction } from 'vuexfire'

const state = {
  subjects: null,
  groups: null
}

const mutations = {}
const getters = {}

const actions = {
  bindSubjects: firestoreAction(async ({ bindFirestoreRef, rootState }) => {
    if (rootState.user.isTeacher)
      bindFirestoreRef(
        'subjects',
        db.collection('subjects').where('teacherId', '==', rootState.user.uid))
    else {
      let groupsWhereStudentPresented = await db.collection('groups')
        .where('students', 'array-contains', rootState.user.uid).get()
      let subjectIdList = groupsWhereStudentPresented.docs.map(c => c.data().subjectId)
      await bindFirestoreRef(
        'subjects',
        db.collection('subjects')
          .where(firebase.firestore.FieldPath.documentId(), 'in', subjectIdList)
      )
    }
  }),

  bindGroup: firestoreAction(({ bindFirestoreRef }, subjectId) =>
    bindFirestoreRef(
      'groups',
      db.collection('groups').where('subjectId', '==', subjectId))
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
  },

  async addGroup(_, groupData) {
    await db.collection('groups').add({
      name: groupData.name,
      subjectId: groupData.subjectId
    })
  }
}

export default { state, getters, mutations, actions }