import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'

Vue.use(Vuex)

export default new Vuex.Store({
  mutations: {
    ...vuexfireMutations
  }
})

// mutations: {
//   setBoundSubjectId: (s, id) => (s.boundSubjectId = id)
// }

// // actions: firestoreBindings
