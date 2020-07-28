import store from '@/store'
import firebase from 'firebase/app'
import { FIRESTORE } from '@/main'
import { firestoreAction } from 'vuexfire'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'
import { UserModule, IUser } from '@/store/modules/user'

export interface ISubject {
  id: string
  name: string
  course: number
  teacher: IUser
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
  public async AddSubject(options: Partial<ISubject>) {
    await FIRESTORE.collection('subjects').add({
      name: options.name,
      course: options.course,
      teacher: FIRESTORE.collection('users').doc(UserModule.id)
    })
  }

  @Action
  public async UpdateSubject(options: Partial<ISubject>) {
    await FIRESTORE.collection('subjects').doc(options.id).update({
      name: options.name,
      course: options.course
    })
  }

  @Action
  public async DeleteSubject(id: string) {
    await FIRESTORE.collection('subjects').doc(id).delete()
  }
}

export const SubjectsModule = getModule(Subjects)
