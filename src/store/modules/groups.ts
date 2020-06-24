import firebase from 'firebase/app'
import store from '@/store'
import { firestoreAction } from 'vuexfire'
import { FIRESTORE } from '@/main'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'
import { UserModule, IUser } from './user'
import { ISubject } from './subjects'
import { MarksModule } from './marks'

export interface IGroup {
  id: string
  name: string
  students: IUser[]
  subject: ISubject
  joinable: boolean
}

export interface IGroupOptions {
  name?: string
  joinable?: boolean
  subjectId?: string
}

@Module({ dynamic: true, store, name: 'groups' })
class Groups extends VuexModule {
  groups: IGroup[] = []

  @Action
  BindGroups(subjectId: string) {
    return (firestoreAction(({ bindFirestoreRef }) => {
      //if (subjectId === rootState.boundSubjectId) return

      if (UserModule.isTeacher)
        return bindFirestoreRef(
          'groups',
          FIRESTORE.collection('groups').where(
            'subject',
            '==',
            FIRESTORE.collection('subjects').doc(subjectId)
          )
        )
      else {
        return bindFirestoreRef(
          'groups',
          FIRESTORE.collection('groups').where(
            'students',
            'array-contains',
            FIRESTORE.collection('users').doc(UserModule.id)
          )
        )
      }
    }) as any)(this.context)
  }

  @Action
  public async AddGroup(options: IGroupOptions) {
    const group = await FIRESTORE.collection('groups').add({
      name: options.name,
      students: [],
      subject: FIRESTORE.collection('subjects').doc(options.subjectId),
      joinable: true
    })
    return group.id
  }

  @Action
  public async UpdateGroup(groupId: string, options: IGroupOptions) {
    await FIRESTORE.collection('groups').doc(groupId).update(options)
  }

  @Action
  public async DeleteGroup(groupId: string) {
    await FIRESTORE.collection('groups').doc(groupId).delete()
  }

  @Action
  public async DeleteStudentFromGroup(options: {
    student: { isFake: boolean; id: string; marksIds: string[] }
    groupId: string
  }) {
    await FIRESTORE.collection('groups')
      .doc(options.groupId)
      .update({
        students: firebase.firestore.FieldValue.arrayRemove(
          FIRESTORE.collection(
            options.student.isFake ? 'fake-students' : 'users'
          ).doc(options.student.id)
        )
      })

    options.student.marksIds.forEach(id => MarksModule.DeleteMark(id))

    if (options.student.isFake)
      await FIRESTORE.collection('fake-students')
        .doc(options.student.id)
        .delete()
  }

  @Action
  public async GetGroupInfo(groupId: string) {
    const groupRef = await FIRESTORE.collection('groups').doc(groupId).get()
    const groupData: any = groupRef.data()
    if (!groupData) return false
    let subject = await groupData.subject.get()
    subject = { ...subject.data(), id: subject.id }
    const teacherRef = await FIRESTORE.collection('users')
      .doc(subject.teacherId)
      .get()
    const teacherData: any = teacherRef.data()
    return {
      groupName: groupData.name,
      joinable: groupData.joinable,
      teacherName: teacherData.name + ' ' + teacherData.surname,
      subject,
      alreadyPresented: groupData.students.indexOf(UserModule.id) > -1
    }
  }

  @Action
  public async JoinGroup(groupId: string) {
    await FIRESTORE.collection('groups')
      .doc(groupId)
      .update({
        students: firebase.firestore.FieldValue.arrayUnion(
          FIRESTORE.collection('users').doc(UserModule.id)
        )
      })
  }
}

export const GroupsModule = getModule(Groups)
