import firebase from 'firebase/app'
import { db, storage } from '../../main'
import { firestoreAction } from 'vuexfire'

const state = {
  subjects: null,
  groups: null,
  tasks: null,
  marks: null,
  filesUploadProgress: -1
}

const mutations = {}
const getters = {}

const actions = {
  bindSubjects: firestoreAction(async ({ bindFirestoreRef, rootState }) => {
    if (rootState.user.isTeacher)
      return bindFirestoreRef(
        'subjects',
        db.collection('subjects').where('teacherId', '==', rootState.user.uid))
    else {
      let groupsWhereStudentPresented = await db.collection('groups')
        .where('students', 'array-contains', db.collection('users').doc(rootState.user.uid)).get()
      let subjectIdList = groupsWhereStudentPresented.docs.map(c => c.data().subject.id)
      if (subjectIdList.length)
        return bindFirestoreRef(
          'subjects',
          db.collection('subjects').where(firebase.firestore.FieldPath.documentId(), 'in', subjectIdList)
        )
    }
  }),

  bindGroup: firestoreAction(({ bindFirestoreRef }, subjectId) => {
    return bindFirestoreRef(
      'groups',
      db.collection('groups').where('subject', '==', db.collection('subjects').doc(subjectId)))
  }),

  bindTasks: firestoreAction(({ bindFirestoreRef, rootState }, subjectId) => {
    if (rootState.user.isTeacher)
      return bindFirestoreRef(
        'tasks',
        db.collection('tasks').where('subjectId', '==', subjectId))
    else {
      return bindFirestoreRef(
        'tasks',
        db.collection('tasks')
          .where('subjectId', '==', subjectId)
          .where('visible', '==', true))
    }
  }),

  bindMarks: firestoreAction(({ bindFirestoreRef }, subjectId) => {
    return bindFirestoreRef(
      'marks',
      db.collection('marks').where('subject', '==', db.collection('subjects').doc(subjectId)))
  }),

  async addSubject({ rootState }, subj) {
    db.collection('subjects').add({
      name: subj.name,
      course: +subj.course,
      teacherId: rootState.user.uid
    })
  },

  async updateSubject(_, data) {
    await db.collection('subjects').doc(data.id).update({
      name: data.name,
      course: data.course
    })
  },

  async deleteSubject(_, id) {
    await db.collection('subjects').doc(id).delete()
  },

  async uploadFiles({ state }, files) {
    let pinnedFiles = []
    let filesHere = false
    for (let file of files) {
      if (!filesHere) {
        state.filesUploadProgress = 0
        filesHere = true
      }
      let ref = storage.ref(`lab_files/${Math.random().toString(7)}/${file.name}`)
      await ref.put(file)
      let link = await ref.getDownloadURL()
      pinnedFiles.push({ name: file.name, link, path: ref.fullPath, size: file.size })
      state.filesUploadProgress++
    }
    return pinnedFiles
  },

  async removeFiles(_, paths) {
    for (let path of paths)
      await storage.ref(path).delete()
  },

  async addTask({ commit, dispatch }, newTask) {
    commit('setLoading', 'btn-addLab')
    const pinnedFiles = await dispatch('uploadFiles', newTask.files)
    await db.collection('tasks').add({
      name: newTask.name,
      number: newTask.number,
      description: newTask.description,
      score: newTask.score,
      files: pinnedFiles,
      visible: newTask.visible,
      subjectId: newTask.subjectId
    })
    state.filesUploadProgress = -1
    commit('unsetLoading')
  },

  async editTask({ state, commit, dispatch }, task) {
    commit('setLoading', 'btn-addLab')
    dispatch('removeFiles', task.oldFilesToDelete)
    const newFiles = await dispatch('uploadFiles', task.newFilesToUpload)
    await db.collection('tasks').doc(task.id).update({
      name: task.name,
      number: task.number,
      description: task.description,
      score: task.score,
      files: task.files.concat(newFiles),
      visible: task.visible
    })
    commit('unsetLoading')
    state.filesUploadProgress = -1
  },

  toggleTaskVisibility(_, data) {
    db.collection('tasks').doc(data.id).update({
      visible: data.state
    })
  },

  async deleteTask(_, id) {
    await db.collection('tasks').doc(id).delete()
  },

  async addGroup(_, groupData) {
    await db.collection('groups').add({
      name: groupData.name,
      students: [],
      subject: db.collection('subjects').doc(groupData.subjectId)
    })
  },

  async markTask(_, markData) {
    db.collection('marks').add({
      student: db.collection('users').doc(markData.studentId),
      task: db.collection('tasks').doc(markData.taskId),
      group: db.collection('groups').doc(markData.groupId),
      subject: db.collection('subjects').doc(markData.subjectId),
      score: markData.score
    })
  }
}

export default { state, getters, mutations, actions }