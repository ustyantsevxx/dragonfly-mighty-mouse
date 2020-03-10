import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

const deleteAllGroupsWithSubject = functions.firestore
  .document('subjects/{subjectId}')
  .onDelete(async (subject, _) => {
    let batch = db.batch()
    let b = await db.collection('groups')
      .where('subjectId', '==', subject.id).get()
    b.forEach(c => batch.delete(c.ref))
    await batch.commit()
  })

export { deleteAllGroupsWithSubject }
