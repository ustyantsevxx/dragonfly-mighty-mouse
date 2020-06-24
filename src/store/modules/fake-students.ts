import firebase from 'firebase/app'
import store from '@/store'
import { FIRESTORE } from '@/main'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'
import { MarksModule } from './marks'
import { GroupsModule } from './groups'

@Module({ dynamic: true, store, name: 'fakeStudents' })
class FakeStudents extends VuexModule {
  @Action
  async AddFakeStudentToGroup(options: {
    name: string
    surname: string
    groupId: string
  }) {
    const newFakeStudent = await FIRESTORE.collection('fake-students').add({
      name: options.name,
      surname: options.surname,
      fake: true
    })
    // перенести в группы-модуль
    await FIRESTORE.collection('groups')
      .doc(options.groupId)
      .update({
        students: firebase.firestore.FieldValue.arrayUnion(newFakeStudent)
      })
  }

  @Action
  async UpdateFakeStudent(
    fakeStudentId: string,
    options: { name: string; surname: string }
  ) {
    await FIRESTORE.collection('fake-students')
      .doc(fakeStudentId)
      .update(options)
  }

  @Action
  async UnionWithReal(options: {
    fakeStudentId: string
    realStudentId: string
    groupId: string
    subjectId: string
  }) {
    const fakeStudentsMarks = MarksModule.marks
      .filter(mark => mark.student.id === options.fakeStudentId)
      .map(m => m.id)

    const realMarks = MarksModule.marks
      .filter(mark => mark.student.id === options.realStudentId)
      .map(m => m.id)

    for (const mark of fakeStudentsMarks) {
      FIRESTORE.collection('marks')
        .doc(mark)
        .update({
          student: FIRESTORE.collection('users').doc(options.realStudentId)
        })
    }

    MarksModule.BindMarks({ subjectId: options.subjectId, force: true })

    GroupsModule.DeleteStudentFromGroup({
      student: {
        id: options.fakeStudentId,
        isFake: true,
        marksIds: realMarks
      },
      groupId: options.groupId
    })
  }
}

export const FakeStudentsModule = getModule(FakeStudents)
