import firebase from 'firebase/app'
import { FIRESTORE } from '@/main'
import {
  DELETE_MARK,
  ADD_GROUP,
  UPDATE_GROUP,
  TOGGLE_GROUP_JOINABLE,
  DELETE_GROUP,
  DELETE_STUDENT_FROM_GROUP,
  ADD_FAKE_STUDENT_TO_GROUP,
  UPDATE_FAKE_STUDENT,
  UNION_FAKE_STUDENT_WITH_REAL,
  JOIN_GROUP,
  GET_GROUP_INFO,
  BIND_MARKS
} from './actions.type'

const state = {}
const mutations = {}
const getters = {}

const actions = {
  async [ADD_GROUP](_, groupData) {
    const group = await FIRESTORE.collection('groups').add({
      name: groupData.name,
      students: [],
      subject: FIRESTORE.collection('subjects').doc(groupData.subjectId),
      joinable: true
    })
    return group.id
  },

  async [UPDATE_GROUP](_, groupData) {
    await FIRESTORE.collection('groups').doc(groupData.id).update({
      name: groupData.name
    })
  },

  [TOGGLE_GROUP_JOINABLE](_, data) {
    FIRESTORE.collection('groups').doc(data.id).update({
      joinable: data.state
    })
  },

  async [DELETE_GROUP](_, id) {
    await FIRESTORE.collection('groups').doc(id).delete()
  },

  async [DELETE_STUDENT_FROM_GROUP]({ dispatch }, options) {
    await FIRESTORE.collection('groups')
      .doc(options.groupId)
      .update({
        students: firebase.firestore.FieldValue.arrayRemove(
          FIRESTORE.collection(options.fake ? 'fake-students' : 'users').doc(
            options.studentId
          )
        )
      })
    options.marksToDelete.forEach(id => dispatch(DELETE_MARK, id))
    if (options.fake)
      await FIRESTORE.collection('fake-students')
        .doc(options.studentId)
        .delete()
  },

  async [ADD_FAKE_STUDENT_TO_GROUP](_, options) {
    const newFakeStudent = await FIRESTORE.collection('fake-students').add({
      name: options.name,
      surname: options.surname,
      fake: true
    })
    await FIRESTORE.collection('groups')
      .doc(options.groupId)
      .update({
        students: firebase.firestore.FieldValue.arrayUnion(newFakeStudent)
      })
  },

  async [UPDATE_FAKE_STUDENT](_, options) {
    await FIRESTORE.collection('fake-students').doc(options.id).update({
      name: options.name,
      surname: options.surname
    })
  },

  async [UNION_FAKE_STUDENT_WITH_REAL]({ rootState, dispatch }, options) {
    const fakeStudentsMarks = await rootState.marks
      .filter(mark => mark.student.id === options.fakeId)
      .map(m => m.id)

    const realMarks = await rootState.marks
      .filter(mark => mark.student.id === options.realId)
      .map(m => m.id)

    for (const mark of fakeStudentsMarks) {
      FIRESTORE.collection('marks')
        .doc(mark)
        .update({
          student: FIRESTORE.collection('users').doc(options.realId)
        })
    }

    dispatch(BIND_MARKS, { subjectId: options.subjectId, force: true })

    await dispatch(DELETE_STUDENT_FROM_GROUP, {
      studentId: options.fakeId,
      marksToDelete: realMarks,
      groupId: options.groupId,
      fake: true
    })
  },

  async [GET_GROUP_INFO]({ rootState }, id) {
    let group = await FIRESTORE.collection('groups').doc(id).get()
    group = group.data()
    if (!group) return false
    let subject = await group.subject.get()
    subject = { ...subject.data(), id: subject.id }
    let teacher = await FIRESTORE.collection('users')
      .doc(subject.teacherId)
      .get()
    teacher = teacher.data()
    return {
      groupName: group.name,
      joinable: group.joinable,
      teacherName: teacher.name + ' ' + teacher.surname,
      subject,
      alreadyPresented: group.students.indexOf(rootState.user.uid) > -1
    }
  },

  async [JOIN_GROUP]({ rootState }, id) {
    await FIRESTORE.collection('groups')
      .doc(id)
      .update({
        students: firebase.firestore.FieldValue.arrayUnion(
          FIRESTORE.collection('users').doc(rootState.user.uid)
        )
      })
  }
}

export default { state, getters, mutations, actions }
