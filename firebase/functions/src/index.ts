import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()
const storage = admin.storage()

const deleteTasksAndGroupsWithSubject = functions.firestore
  .document('subjects/{subjectId}')
  .onDelete(async (subject, _) => {
    let batch = db.batch()
    let groups = await db.collection('groups')
      .where('subjectId', '==', subject.id).get()
    let tasks = await db.collection('tasks')
      .where('subjectId', '==', subject.id).get()
    groups.forEach(group => batch.delete(group.ref))
    tasks.forEach(task => batch.delete(task.ref))
    await batch.commit()
  })

const deleteAllFilesWithTask = functions.firestore
  .document('tasks/{taskId}')
  .onDelete(async (task, _) => {
    let taskData = task.data() || {}
    for (let file of taskData.files)
      await storage.bucket().file(file.path).delete()
  })

export {
  deleteTasksAndGroupsWithSubject,
  deleteAllFilesWithTask
}
