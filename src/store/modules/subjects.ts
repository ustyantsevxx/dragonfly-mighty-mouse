import store from '@/store'
import firebase from 'firebase/app'
import { FIRESTORE } from '@/main'
import { firestoreAction } from 'vuexfire'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'
import { UserModule } from '@/store/modules/user'

export interface ISubject {
  id: string
  name: string
  course: number
}

export interface ISubjectOptions {
  name: string
  course: number
}

@Module({ dynamic: true, store, name: 'subjects' })
class Subjects extends VuexModule {
  subjects: ISubject[] = []

  @Action
  public async BindSubjects() {
    return (firestoreAction(async ({ bindFirestoreRef }) => {
      if (UserModule.isTeacher)
        return bindFirestoreRef(
          'subjects',
          FIRESTORE.collection('subjects').where(
            'teacher',
            '==',
            FIRESTORE.collection('users').doc(UserModule.id)
          )
        )
      else {
        const groupsWithStudent = await FIRESTORE.collection('groups')
          .where(
            'students',
            'array-contains',
            FIRESTORE.collection('users').doc(UserModule.id)
          )
          .get()

        const subjectIdList = groupsWithStudent.docs.map(
          c => c.data().subject.id
        )

        if (subjectIdList.length)
          return bindFirestoreRef(
            'subjects',
            FIRESTORE.collection('subjects').where(
              firebase.firestore.FieldPath.documentId(),
              'in',
              subjectIdList
            )
          )
      }
    }) as any)(this.context)
  }

  @Action
  public async AddSubject(options: ISubjectOptions) {
    await FIRESTORE.collection('subjects').add({
      name: options.name,
      course: options.course,
      teacher: FIRESTORE.collection('users').doc(UserModule.id)
    })
  }

  @Action
  public async UpdateSubject(subjectId: string, options: ISubjectOptions) {
    await FIRESTORE.collection('subjects').doc(subjectId).update({
      name: options.name,
      course: options.course
    })
  }

  @Action
  public async DeleteSubject(subjectId: string) {
    await FIRESTORE.collection('subjects').doc(subjectId).delete()
  }
}

export const SubjectsModule = getModule(Subjects)
