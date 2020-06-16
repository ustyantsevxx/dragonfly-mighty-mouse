import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import { IUserState } from '@/store/user.module'
import { IToastsState } from './toasts.module'

Vue.use(Vuex)

interface IRootState {
  user: IUserState
  toasts: IToastsState
}

export default new Vuex.Store<IRootState>({
  mutations: {
    ...vuexfireMutations
  }
})

// mutations: {
//   setBoundSubjectId: (s, id) => (s.boundSubjectId = id)
// }

// // actions: firestoreBindings
