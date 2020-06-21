import firebase from 'firebase/app'
import { FIRESTORE } from '@/main'
import { firestoreAction } from 'vuexfire'
import { UserModule } from './modules/user'

export default {
  BIND_SUBJECTS: firestoreAction(async ({ bindFirestoreRef }) => {
    if (UserModule.isTeacher)
      return bindFirestoreRef(
        'subjects.subjects',
        FIRESTORE.collection('subjects').where('teacherId', '==', UserModule.id)
      )
    else {
      const groupsWithStudent = await FIRESTORE.collection('groups')
        .where(
          'students',
          'array-contains',
          FIRESTORE.collection('users').doc(UserModule.id)
        )
        .get()

      const subjectIdList = groupsWithStudent.docs.map(c => c.data().subject.id)

      if (subjectIdList.length)
        return bindFirestoreRef(
          'subjects.subjects',
          FIRESTORE.collection('subjects').where(
            firebase.firestore.FieldPath.documentId(),
            'in',
            subjectIdList
          )
        )
    }
  })

  // [BIND_GROUPS]: firestoreAction(
  //   ({ bindFirestoreRef, rootState }, subjectId) => {
  //     if (subjectId === rootState.boundSubjectId) return

  //     if (rootState.user.isTeacher)
  //       return bindFirestoreRef(
  //         'groups',
  //         FIRESTORE.collection('groups').where(
  //           'subject',
  //           '==',
  //           FIRESTORE.collection('subjects').doc(subjectId)
  //         )
  //       )
  //     else {
  //       return bindFirestoreRef(
  //         'groups',
  //         FIRESTORE.collection('groups').where(
  //           'students',
  //           'array-contains',
  //           FIRESTORE.collection('users').doc(rootState.user.uid)
  //         )
  //       )
  //     }
  //   }
  // ),

  // [BIND_TASKS]: firestoreAction(
  //   ({ bindFirestoreRef, rootState }, subjectId) => {
  //     if (subjectId === rootState.boundSubjectId) return

  //     if (rootState.user.isTeacher)
  //       return bindFirestoreRef(
  //         'tasks',
  //         FIRESTORE.collection('tasks').where('subjectId', '==', subjectId)
  //       )
  //     else {
  //       return bindFirestoreRef(
  //         'tasks',
  //         FIRESTORE.collection('tasks')
  //           .where('subjectId', '==', subjectId)
  //           .where('visible', '==', true)
  //       )
  //     }
  //   }
  // ),

  // [BIND_MARKS]: firestoreAction(({ rootState, bindFirestoreRef }, options) => {
  //   if (
  //     rootState.marks &&
  //     !options.force &&
  //     options.subjectId === rootState.boundSubjectId
  //   )
  //     return
  //   return bindFirestoreRef(
  //     'marks',
  //     FIRESTORE.collection('marks').where(
  //       'subject',
  //       '==',
  //       FIRESTORE.collection('subjects').doc(options.subjectId)
  //     )
  //   )
  // })
}
