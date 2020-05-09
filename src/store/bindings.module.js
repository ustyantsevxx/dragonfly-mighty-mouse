import firebase from 'firebase/app'
import { db } from '@/main'
import { firestoreAction } from 'vuexfire'
import {
  BIND_SUBJECTS,
  BIND_GROUPS,
  BIND_TASKS,
  BIND_MARKS
} from './actions.type'

export default {
  [BIND_SUBJECTS]: firestoreAction(async ({ bindFirestoreRef, rootState }) => {
    if (rootState.user.isTeacher)
      return bindFirestoreRef(
        'subjects',
        db.collection('subjects').where('teacherId', '==', rootState.user.uid)
      )
    else {
      let groupsWithStudent = await db
        .collection('groups')
        .where(
          'students',
          'array-contains',
          db.collection('users').doc(rootState.user.uid)
        )
        .get()

      let subjectIdList = groupsWithStudent.docs.map(c => c.data().subject.id)

      if (subjectIdList.length)
        return bindFirestoreRef(
          'subjects',
          db
            .collection('subjects')
            .where(
              firebase.firestore.FieldPath.documentId(),
              'in',
              subjectIdList
            )
        )
    }
  }),

  [BIND_GROUPS]: firestoreAction(
    ({ bindFirestoreRef, rootState }, subjectId) => {
      if (rootState.user.isTeacher)
        return bindFirestoreRef(
          'groups',
          db
            .collection('groups')
            .where('subject', '==', db.collection('subjects').doc(subjectId))
        )
      else {
        return bindFirestoreRef(
          'groups',
          db
            .collection('groups')
            .where(
              'students',
              'array-contains',
              db.collection('users').doc(rootState.user.uid)
            )
        )
      }
    }
  ),

  [BIND_TASKS]: firestoreAction(
    ({ bindFirestoreRef, rootState }, subjectId) => {
      if (rootState.user.isTeacher)
        return bindFirestoreRef(
          'tasks',
          db.collection('tasks').where('subjectId', '==', subjectId)
        )
      else {
        return bindFirestoreRef(
          'tasks',
          db
            .collection('tasks')
            .where('subjectId', '==', subjectId)
            .where('visible', '==', true)
        )
      }
    }
  ),

  [BIND_MARKS]: firestoreAction(({ bindFirestoreRef }, subjectId) => {
    return bindFirestoreRef(
      'marks',
      db
        .collection('marks')
        .where('subject', '==', db.collection('subjects').doc(subjectId))
    )
  })
}
