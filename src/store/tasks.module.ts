import { db, storage } from '@/main'
import {
  DELETE_TASK_FILES,
  UPLOAD_TASK_FILES,
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  TOGGLE_TASK_VISIBILITY
} from './actions.type'

const state = {
  filesUploadProgress: -1
}

const mutations = {}
const getters = {}

const actions = {
  async [ADD_TASK]({ dispatch, state }, newTask) {
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
  },

  async [UPDATE_TASK]({ state, dispatch }, task) {
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
    state.filesUploadProgress = -1
  },

  async [DELETE_TASK](_, id) {
    await db.collection('tasks').doc(id).delete()
  },

  async [UPLOAD_TASK_FILES]({ state }, files) {
    const pinnedFiles = []
    let filesHere = false
    for (const file of files) {
      if (!filesHere) {
        state.filesUploadProgress = 0
        filesHere = true
      }
      const ref = storage.ref(
        `lab_files/${Math.random().toString(7)}/${file.name}`
      )
      await ref.put(file)
      const link = await ref.getDownloadURL()
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
    for (const path of paths) await storage.ref(path).delete()
  },

  [TOGGLE_TASK_VISIBILITY](_, data) {
    db.collection('tasks').doc(data.id).update({
      visible: data.state
    })
  }
}

export default { state, getters, mutations, actions }
