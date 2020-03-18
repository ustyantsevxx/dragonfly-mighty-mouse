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
    subject = { ...subject.data(), id: subject.id }
    let teacher = await db.collection('users').doc(subject.teacherId).get()
    teacher = teacher.data()
    return {
      groupName: group.name,
      teacherName: teacher.name + ' ' + teacher.surname,
      subject
    }
  },
  async joinGroup({ rootState }, id) {
    await db.collection('groups').doc(id).update({
      students: firebase.firestore.FieldValue.arrayUnion(rootState.user.uid)
    })
  }
}

export default { state, getters, mutations, actions }