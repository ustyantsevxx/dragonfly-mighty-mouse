import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { auth } from '../main'
Vue.use(Router)

import appRoutes from './routes/appRoutes'
import authRoutes from './routes/authRoutes'
import teacherRoutes from './routes/teacherRoutes'
import studentRoutes from './routes/studentRoutes'

const routes = [
  ...appRoutes,
  ...authRoutes,
  ...teacherRoutes,
  ...studentRoutes
]

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 })
})

router.beforeEach((to, _from, next) => {
  const signed = !!auth.currentUser
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresGuest = to.matched.some(r => r.meta.requiresGuest)
  const requiresTeacher = to.matched.some(r => r.meta.requiresTeacher)
  const requiresStudent = to.matched.some(r => r.meta.requiresStudent)
  const isTeacher = store.state.user.isTeacher

  if (requiresAuth && !signed) {
    store.commit('setToastMsg', { error: true, msg: 'Войдите для доступа к данной странице' })
    next({
      path: '/login',
      query: { next: to.fullPath }
    })
  }
  else if (requiresGuest && signed) next('/')
  else {
    if (requiresTeacher && !isTeacher || requiresStudent && isTeacher) {
      store.commit('setToastMsg', { error: true, msg: 'У вас нет доступа к данной странице!' })
      next('/')
    }
    else {
      next()
      if (!to.meta.dynamicTitle) document.title = to.meta.title
    }
  }
})

export default router