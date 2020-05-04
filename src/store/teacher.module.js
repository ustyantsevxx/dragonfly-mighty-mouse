import { db, storage } from '../main'
import {
  DELETE_TASK_FILES,
  UPLOAD_TASK_FILES,
  ADD_SUBJECT,
  UPDATE_SUBJECT,
  DELETE_SUBJECT,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  MARK_TASK,
  DELETE_MARK,
  TOGGLE_TASK_VISIBILITY,
  ADD_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  UPDATE_MARK
} from './actions.type'

const state = {
  filesUploadProgress: -1
}

const mutations = {}
const getters = {}

const subjectActions = {
  async [ADD_SUBJECT]({ rootState }, subj) {
    db.collection('subjects').add({
      name: subj.name,
      course: subj.course,
      teacherId: rootState.user.uid
    })
  },

  async [UPDATE_SUBJECT](_, data) {
    await db.collection('subjects').doc(data.id).update({
      name: data.name,
      course: data.course
    })
  },

  async [DELETE_SUBJECT](_, id) {
    await db.collection('subjects').doc(id).delete()
  }
}

const taskActions = {
  async [ADD_TASK]({ commit, dispatch, state }, newTask) {
    commit('setLoading', 'btn-addLab')
    const pinnedFiles = await dispatch(UPLOAD_TASK_FILES, newTask.files)
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

  async [UPDATE_TASK]({ state, commit, dispatch }, task) {
    commit('setLoading', 'btn-addLab')
    dispatch(DELETE_TASK_FILES, task.oldFilesToDelete)
    const newFiles = await dispatch(UPLOAD_TASK_FILES, task.newFilesToUpload)
    await db
      .collection('tasks')
      .doc(task.id)
      .update({
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

  async [DELETE_TASK](_, id) {
    await db.collection('tasks').doc(id).delete()
  },

  async [MARK_TASK](_, markData) {
    db.collection('marks').add({
      student: db.collection('users').doc(markData.studentId),
      task: db.collection('tasks').doc(markData.taskId),
      group: db.collection('groups').doc(markData.groupId),
      subject: db.collection('subjects').doc(markData.subjectId),
      score: markData.score
    })
  },

  async [UPDATE_MARK](_, markData) {
    await db.collection('marks').doc(markData.id).update({
      score: markData.score
    })
  },

  async [DELETE_MARK](_, markId) {
    await db.collection('marks').doc(markId).delete()
  },

  async [UPLOAD_TASK_FILES]({ state }, files) {
    let pinnedFiles = []
    let filesHere = false
    for (let file of files) {
      if (!filesHere) {
        state.filesUploadProgress = 0
        filesHere = true
      }
      let ref = storage.ref(
        `lab_files/${Math.random().toString(7)}/${file.name}`
      )
      await ref.put(file)
      let link = await ref.getDownloadURL()
      pinnedFiles.push({
        name: file.name,
        link,
        path: ref.fullPath,
        size: file.size
      })
      state.filesUploadProgress++
    }
    return pinnedFiles
  },

  async [DELETE_TASK_FILES](_, paths) {
    for (let path of paths) await storage.ref(path).delete()
  },

  [TOGGLE_TASK_VISIBILITY](_, data) {
    db.collection('tasks').doc(data.id).update({
      visible: data.state
    })
  }
}

const groupActions = {
  async [ADD_GROUP](_, groupData) {
    await db.collection('groups').add({
      name: groupData.name,
      students: [],
      subject: db.collection('subjects').doc(groupData.subjectId)
    })
  },

  async [UPDATE_GROUP](_, groupData) {
    await db.collection('groups').doc(groupData.id).update({
      name: groupData.name
    })
  },

  async [DELETE_GROUP](_, id) {
    await db.collection('groups').doc(id).delete()
  }
}

const actions = {
  ...subjectActions,
  ...taskActions,
  ...groupActions
}

export default { state, getters, mutations, actions }
