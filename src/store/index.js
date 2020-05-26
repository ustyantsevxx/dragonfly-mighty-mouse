import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
Vue.use(Vuex)

import user from './auth.module'
import groupsModule from './groups.module'
import tasksModule from './tasks.module'
import marksModule from './marks.module'
import subjectsModule from './subjects.module'
import firestoreBindings from './bindings.module'

export default new Vuex.Store({
  modules: {
    user,
    groupsModule,
    tasksModule,
    marksModule,
    subjectsModule
  },

  state: {
    toastMsg: null,
    // binded:
    subjects: null,
    groups: null,
    tasks: null,
    marks: null
  },

  mutations: {
    ...vuexfireMutations,
    setToastMsg: (s, msg) => (s.toastMsg = msg),
    unsetToastMsg: s => (s.toastMsg = null)
  },

  actions: firestoreBindings
})
