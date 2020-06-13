import { db } from '@/main'
import { ADD_MARK, DELETE_MARK, UPDATE_MARK } from './actions.type'

const state = {}
const mutations = {}
const getters = {}

const actions = {
  async [ADD_MARK](_, markData) {
    db.collection('marks').add({
      student: db
        .collection(markData.fake ? 'fake-students' : 'users')
        .doc(markData.studentId),
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
  }
}

export default { state, getters, mutations, actions }
