import firebase from 'firebase/app'
import { db } from '../../main'

const state = {}
const mutations = {}
const getters = {}

const actions = {
  async groupInfo(_, id) {
    let group = await db.collection('groups').doc(id).get()
    group = group.data()
    let subject = await db.collection('subjects').doc(group.subjectId).get()
    let teacher = await db.collection('users').doc(subject.get('teacherId')).get()
    return {
      groupName: group.name,
      teacherName: `${teacher.get('name')} ${teacher.get('surname')}`,
      subject: {
        name: subject.get('name'),
        course: subject.get('course')
      }
    }
  },
  async joinGroup({ rootState }, id) {
    await db.collection('groups').doc(id).update({
      students: firebase.firestore.FieldValue.arrayUnion(rootState.user.uid)
    })
  }
}

export default { state, getters, mutations, actions }