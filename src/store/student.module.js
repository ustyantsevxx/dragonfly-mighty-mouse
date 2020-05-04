import firebase from 'firebase/app'
import { db } from '../main'
import { GET_GROUP_INFO, JOIN_GROUP } from './actions.type'

const state = {}
const mutations = {}
const getters = {}

const actions = {
  async [GET_GROUP_INFO]({ rootState }, id) {
    let group = await db.collection('groups').doc(id).get()
    group = group.data()
    if (!group) return false
    let subject = await group.subject.get()
    subject = { ...subject.data(), id: subject.id }
    let teacher = await db.collection('users').doc(subject.teacherId).get()
    teacher = teacher.data()
    return {
      groupName: group.name,
      joinable: group.joinable,
      teacherName: teacher.name + ' ' + teacher.surname,
      subject,
      alreadyPresented: group.students.indexOf(rootState.user.uid > -1)
    }
  },
  async [JOIN_GROUP]({ rootState }, id) {
    await db
      .collection('groups')
      .doc(id)
      .update({
        students: firebase.firestore.FieldValue.arrayUnion(
          db.collection('users').doc(rootState.user.uid)
        )
      })
  }
}

export default { state, getters, mutations, actions }
