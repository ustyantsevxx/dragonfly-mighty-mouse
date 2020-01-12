import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'
Vue.use(Router)
import authRoutes from './auth'
import teacherRoutes from './teacher'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Main')
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

router.beforeEach((to, _, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresGuest = to.matched.some(r => r.meta.requiresGuest)

  if (requiresAuth && !currentUser) next({
    path: '/login',
    query: { next: to.fullPath }
  })
  else if (requiresGuest && currentUser) {
    next('/')
    document.title = 'Scimitar'
  }
  else {
    next()
    document.title = to.meta.title || 'Scimitar'
  }
})

export default router