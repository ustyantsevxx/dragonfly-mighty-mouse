import store from '@/store'
import { firestoreAction } from 'vuexfire'
import { FIRESTORE, STORAGE } from '@/main'
import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators'

export interface ITaskOptions {
  name: string
  number: number
  description: string
  score: number
  files: any[]
  visible: boolean
  subjectId: string
}

@Module({ dynamic: true, store, name: 'tasks' })
class Tasks extends VuexModule {
  filesUploadProgress = -1

  // @Action
  // BindTasks = firestoreAction(({ bindFirestoreRef, rootState }, subjectId) => {
  //   if (subjectId === rootState.boundSubjectId) return

  //   if (rootState.user.isTeacher)
  //     return bindFirestoreRef(
  //       'tasks',
  //       FIRESTORE.collection('tasks').where('subjectId', '==', subjectId)
  //     )
  //   else {
  //     return bindFirestoreRef(
  //       'tasks',
  //       FIRESTORE.collection('tasks')
  //         .where('subjectId', '==', subjectId)
  //         .where('visible', '==', true)
  //     )
  //   }
  // })

  @Action
  async AddTask(options: ITaskOptions) {
    const pinnedFiles = await this.UploadTaskFiles(options.files)
    await FIRESTORE.collection('tasks').add({
      name: options.name,
      number: options.number,
      description: options.description,
      score: options.score,
      files: pinnedFiles,
      visible: options.visible,
      subject: FIRESTORE.collection('subjects').doc(options.subjectId)
    })
    this.filesUploadProgress = -1
  }

  @Action
  async UpdateTask(
    taskId: string,
    options: ITaskOptions & { oldFilesToDelete: any[]; newFilesToUpload: any[] }
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
        files: options.files.concat(newFiles),
        visible: options.visible
      })
    this.filesUploadProgress = -1
  }

  @Action
  async DeleteTask(taskId: string) {
    await FIRESTORE.collection('tasks').doc(taskId).delete()
  }

  @Action
  async UploadTaskFiles(files: any[]) {
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
  async DeleteTaskFiles(paths: string[]) {
    for (const path of paths) await STORAGE.ref(path).delete()
  }

  @Action
  ChangeTaskVisibility(options: { taskId: string; state: boolean }) {
    FIRESTORE.collection('tasks').doc(options.taskId).update({
      visible: options.state
    })
  }
}

export const TasksModule = getModule(Tasks)
