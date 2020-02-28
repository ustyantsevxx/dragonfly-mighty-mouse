import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import firebase from 'firebase/app'
import 'firebase/auth'
Vue.use(Router)
import authRoutes from './auth'
import teacherRoutes from './teacher'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main'),
    meta: { title: 'Dragonfly Mighty Mouse' }
  },
  ...authRoutes,
  ...teacherRoutes,
  {
    path: '/account',
    component: () => import('@/views/Account'),
    meta: { requiresAuth: true, title: 'Мой профиль' }
  },
  {
    path: '*',
    component: () => import('@/views/Error'),
    meta: { title: 'Ошибка 404' }
  }
]

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 })
})

router.beforeEach((to, _from, next) => {
  const signed = !!firebase.auth().currentUser
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresGuest = to.matched.some(r => r.meta.requiresGuest)

  if (requiresAuth && !signed) {
    store.commit('setToastMsg', { error: true, msg: 'Войдите для доступа к данной странице' })
    next({
      path: '/login',
      query: { next: to.fullPath }
    })
  }
  else if (requiresGuest && signed) next('/')
  else {
    next()
    if (!to.meta.dynamicTitle) document.title = to.meta.title
  }
})

export default router