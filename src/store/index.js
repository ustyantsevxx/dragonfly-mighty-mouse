import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './userModule'
import commonModule from './commonModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    commonModule,
    userModule
  }
})
