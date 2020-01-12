import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import common from './common'
import teacher from './teacher'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { common, user, teacher }
})
