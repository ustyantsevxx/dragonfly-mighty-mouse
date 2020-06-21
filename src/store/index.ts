import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
import firestoreBindings from '@/store/bindings'

Vue.use(Vuex)

export default new Vuex.Store({
  mutations: {
    ...vuexfireMutations
  },
  actions: firestoreBindings
})

// mutations: {
//   setBoundSubjectId: (s, id) => (s.boundSubjectId = id)
// }

// //
