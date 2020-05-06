import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
Vue.use(Vuex)

import user from './user.module'
import student from './student.module'
import teacher from './teacher.module'
import firestoreBindings from './bindings.module'

export default new Vuex.Store({
  modules: {
    user,
    student,
    teacher
  },

  state: {
    toastMsg: null,
    // next props will be binded by 'firestoreBindings' actions
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
