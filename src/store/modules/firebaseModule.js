import { db } from '../../main'

const actions = {
  async firestoreDelete(_, options) {
    await db.collection(options.collection).doc(options.id).delete()
  },

  async firestoreUpdate(_, options) {
    await db.collection(options.collection)
      .doc(options.id)
      .update(options.data)
  }
}

export default { actions }