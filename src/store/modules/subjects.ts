import store from '@/store'
import { FIRESTORE } from '@/main'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'
import { UserModule } from './user'

export interface ISubjectOptions {
  name: string
  course: number
}

@Module({ dynamic: true, store, name: 'subjects' })
class Subjects extends VuexModule {
  subjects: any[] = []

  @Action
  async BindSubjects() {
    await store.dispatch('BIND_SUBJECTS')
  }

  @Action
  async AddSubject(options: ISubjectOptions) {
    await FIRESTORE.collection('subjects').add({
      name: options.name,
      course: options.course,
      teacher: FIRESTORE.collection('users').doc(UserModule.id)
    })
  }

  @Action
  async UpdateSubject(subjectId: string, options: ISubjectOptions) {
    await FIRESTORE.collection('subjects').doc(subjectId).update({
      name: options.name,
      course: options.course
    })
  }

  @Action
  async DeleteSubject(subjectId: string) {
    await FIRESTORE.collection('subjects').doc(subjectId).delete()
  }
}

export const SubjectsModule = getModule(Subjects)
