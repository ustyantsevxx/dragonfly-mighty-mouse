import { db } from '@/main'
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
    const group = await db.collection('groups').add({
      name: groupData.name,
      students: [],
      subject: db.collection('subjects').doc(groupData.subjectId),
      joinable: true
    })
    return group.id
  },

  async [UPDATE_GROUP](_, groupData) {
    await db.collection('groups').doc(groupData.id).update({
      name: groupData.name
    })
  },

  [TOGGLE_GROUP_JOINABLE](_, data) {
    db.collection('groups').doc(data.id).update({
      joinable: data.state
    })
  },

  async [DELETE_GROUP](_, id) {
    await db.collection('groups').doc(id).delete()
  },

  async [DELETE_STUDENT_FROM_GROUP]({ dispatch }, options) {
    await db
      .collection('groups')
      .doc(options.groupId)
      .update({
        students: db.FieldValue.arrayRemove(
          db
            .collection(options.fake ? 'fake-students' : 'users')
            .doc(options.studentId)
        )
      })
    options.marksToDelete.forEach(id => dispatch(DELETE_MARK, id))
    if (options.fake)
      await db.collection('fake-students').doc(options.studentId).delete()
  },

  async [ADD_FAKE_STUDENT_TO_GROUP](_, options) {
    let newFakeStudent = await db.collection('fake-students').add({
      name: options.name,
      surname: options.surname,
      fake: true
    })
    await db
      .collection('groups')
      .doc(options.groupId)
      .update({
        students: db.FieldValue.arrayUnion(newFakeStudent)
      })
  },

  async [UPDATE_FAKE_STUDENT](_, options) {
    await db.collection('fake-students').doc(options.id).update({
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
      db.collection('marks')
        .doc(mark)
        .update({
          student: db.collection('users').doc(options.realId)
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
      alreadyPresented: group.students.indexOf(rootState.user.uid) > -1
    }
  },

  async [JOIN_GROUP]({ rootState }, id) {
    await db
      .collection('groups')
      .doc(id)
      .update({
        students: db.FieldValue.arrayUnion(
          db.collection('users').doc(rootState.user.uid)
        )
      })
  }
}

export default { state, getters, mutations, actions }
