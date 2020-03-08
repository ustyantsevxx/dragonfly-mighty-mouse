import Vue from 'vue'
import Vuex from 'vuex'
import { vuexfireMutations } from 'vuexfire'
Vue.use(Vuex)

import user from './modules/userModule'
import teacher from './modules/teacherModule'
import student from './modules/studentModule'

export default new Vuex.Store({
  modules: { user, teacher, student },
  state: {
    loadingView: null,
    toastMsg: null
  },
  mutations: {
    ...vuexfireMutations,
    setLoading: (s, view) => s.loadingView = view,
    setToastMsg: (s, msg) => s.toastMsg = msg,
    unsetLoading: s => s.loadingView = null,
    unsetToastMsg: s => s.toastMsg = null,
  }
})
