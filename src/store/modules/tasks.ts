import store from '@/store'
import { firestoreAction } from 'vuexfire'
import { FIRESTORE, STORAGE } from '@/main'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'
import { UserModule } from './user'
import { ISubject } from './subjects'

export interface ITask {
  id: string
  name: string
  number: number
  description: string
  score: number
  files: any[]
  visible: boolean
  subject: ISubject
}

@Module({ dynamic: true, store, name: 'tasks' })
class Tasks extends VuexModule {
  tasks: ITask[] = []
  filesUploadProgress = -1

  @Action
  public async BindTasks(subjectId: string) {
    return (firestoreAction(({ bindFirestoreRef }) => {
      //if (subjectId === rootState.boundSubjectId) return

      if (UserModule.isTeacher)
        return bindFirestoreRef(
          'tasks',
          FIRESTORE.collection('tasks').where('subjectId', '==', subjectId)
        )
      else {
        return bindFirestoreRef(
          'tasks',
          FIRESTORE.collection('tasks')
            .where('subjectId', '==', subjectId)
            .where('visible', '==', true)
        )
      }
    }) as any)(this.context)
  }

  @Action
  public async AddTask(options: Partial<ITask>) {
    const pinnedFiles = await this.UploadTaskFiles(options.files ?? [])
    await FIRESTORE.collection('tasks').add({
      name: options.name,
      number: options.number,
      description: options.description,
      score: options.score,
      files: pinnedFiles,
      visible: options.visible,
      subject: FIRESTORE.collection('subjects').doc(options.subject?.id)
    })
    this.filesUploadProgress = -1
  }

  @Action
  public async UpdateTask(
    taskId: string,
    options: Partial<ITask> & {
      oldFilesToDelete: any[]
      newFilesToUpload: any[]
    }
  ) {
    this.DeleteTaskFiles(options.oldFilesToDelete)
    const newFiles = await this.UploadTaskFiles(options.newFilesToUpload)
    await FIRESTORE.collection('tasks')
      .doc(taskId)
      .update({
        name: options.name,
        number: options.number,
        description: options.description,
        score: options.score,
        files: options.files?.concat(newFiles),
        visible: options.visible
      })
    this.filesUploadProgress = -1
  }

  @Action
  public async DeleteTask(taskId: string) {
    await FIRESTORE.collection('tasks').doc(taskId).delete()
  }

  @Action
  public async UploadTaskFiles(files: any[]) {
    const pinnedFiles = []
    let filesHere = false
    for (const file of files) {
      if (!filesHere) {
        this.filesUploadProgress = 0
        filesHere = true
      }
      const ref = STORAGE.ref(
        `lab_files/${Math.random().toString(7)}/${file.name}`
      )
      await ref.put(file)
      const link = await ref.getDownloadURL()
      pinnedFiles.push({
        name: file.name,
        link,
        path: ref.fullPath,
        size: file.size
      })
      this.filesUploadProgress++
    }
    return pinnedFiles
  }

  @Action
  public async DeleteTaskFiles(paths: string[]) {
    for (const path of paths) await STORAGE.ref(path).delete()
  }

  @Action
  public async ChangeTaskVisibility(options: {
    taskId: string
    state: boolean
  }) {
    await FIRESTORE.collection('tasks').doc(options.taskId).update({
      visible: options.state
    })
  }
}

export const TasksModule = getModule(Tasks)
