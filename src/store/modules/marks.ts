import store from '@/store'
import { FIRESTORE } from '@/main'
import { firestoreAction } from 'vuexfire'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'
import { IGroup } from './groups'
import { IUser } from './user'
import { ISubject } from './subjects'
import { ITask } from './tasks'

export interface IMark {
  id: string
  score: number
  student: IUser
  group: IGroup
  task: ITask
  subject: ISubject
}

export interface IMarkOptions {
  student: {
    id: string
    isFake: boolean
  }
  taskId: string
  groupId: string
  subjectId: string
  score: string
}

@Module({ dynamic: true, store, name: 'marks' })
class Marks extends VuexModule {
  marks: IMark[] = []

  @Action
  public async BindMarks(options: { subjectId: string; force: boolean }) {
    return (firestoreAction(({ bindFirestoreRef }) => {
      // if (
      //   this.marks &&
      //   !options.force &&
      //   options.subjectId === rootState.boundSubjectId
      // )
      //   return
      return bindFirestoreRef(
        'marks',
        FIRESTORE.collection('marks').where(
          'subject',
          '==',
          FIRESTORE.collection('subjects').doc(options.subjectId)
        )
      )
    }) as any)(this.context)
  }

  @Action
  public async AddMark(options: IMarkOptions) {
    const collection = options.student.isFake ? 'fake-students' : 'users'
    FIRESTORE.collection('marks').add({
      student: FIRESTORE.collection(collection).doc(options.student.id),
      task: FIRESTORE.collection('tasks').doc(options.taskId),
      group: FIRESTORE.collection('groups').doc(options.groupId),
      subject: FIRESTORE.collection('subjects').doc(options.subjectId),
      score: options.score
    })
  }

  @Action
  public async UpdateMark(markId: string, options: { score: number }) {
    await FIRESTORE.collection('marks').doc(markId).update(options)
  }

  @Action
  public async DeleteMark(markId: string) {
    await FIRESTORE.collection('marks').doc(markId).delete()
  }
}

export const MarksModule = getModule(Marks)
