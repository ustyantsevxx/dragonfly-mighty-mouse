import { FIRESTORE } from '@/main'
import { ADD_MARK, DELETE_MARK, UPDATE_MARK } from './actions.type'

const state = {}
const mutations = {}
const getters = {}

const actions = {
  async [ADD_MARK](_, markData) {
    FIRESTORE.collection('marks').add({
      student: FIRESTORE.collection(
        markData.fake ? 'fake-students' : 'users'
      ).doc(markData.studentId),
      task: FIRESTORE.collection('tasks').doc(markData.taskId),
      group: FIRESTORE.collection('groups').doc(markData.groupId),
      subject: FIRESTORE.collection('subjects').doc(markData.subjectId),
      score: markData.score
    })
  },

  async [UPDATE_MARK](_, markData) {
    await FIRESTORE.collection('marks').doc(markData.id).update({
      score: markData.score
    })
  },

  async [DELETE_MARK](_, markId) {
    await FIRESTORE.collection('marks').doc(markId).delete()
  }
}

export default { state, getters, mutations, actions }
