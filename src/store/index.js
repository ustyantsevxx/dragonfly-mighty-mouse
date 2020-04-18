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
    loadingView: null,
    toastMsg: null,
    // next props will be binded by 'firestoreBindings' actions
    subjects: null,
    groups: null,
    tasks: null,
    marks: null
  },

  mutations: {
    ...vuexfireMutations,
    setLoading: (s, view) => (s.loadingView = view),
    setToastMsg: (s, msg) => (s.toastMsg = msg),
    unsetLoading: s => (s.loadingView = null),
    unsetToastMsg: s => (s.toastMsg = null)
  },

  actions: firestoreBindings
})
