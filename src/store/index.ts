import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import { IUserState } from '@/store/user.module'

Vue.use(Vuex)

interface IRootState {
  user: IUserState
}

export default new Vuex.Store<IRootState>({})

// mutations: {
//   ...vuexfireMutations,
//   setToastMsg: (s, msg) => (s.toastMsg = msg),
//   unsetToastMsg: s => (s.toastMsg = null),
//   setBoundSubjectId: (s, id) => (s.boundSubjectId = id)
// }

// // actions: firestoreBindings
