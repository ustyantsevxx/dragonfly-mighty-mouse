import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import global from './global'
import teacher from './teacher'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { global, user, teacher }
})
