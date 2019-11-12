import Vue from 'vue'
import Router from 'vue-router'

import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,

  routes: [
    {
      path: '/',
      component: () => import('./views/Main')
    },
    {
      path: '/login',
      component: () => import('./views/Login'),
      meta: { requiresGuest: true, title: 'Вход' }
    },
    {
      path: '/register',
      component: () => import('./views/Register'),
      meta: { requiresGuest: true, title: 'Регистрация' }
    },
    {
      path: '/account',
      component: () => import('./views/Account'),
      meta: { requiresAuth: true, title: 'Мой профиль' }
    },
    {
      path: '/restore',
      component: () => import('./views/RestorePassword'),
      meta: { requiresGuest: true, title: 'Восстановление пароля' }
    },
    {
      path: '*',
      component: () => import('./views/NotFound'),
      meta: { title: 'Ошибка 404' }
    }
  ],
  scrollBehavior: () => ({ x: 0, y: 0 })
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Scimitar'

  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresGuest = to.matched.some(r => r.meta.requiresGuest)

  if (requiresAuth && !currentUser) next({
    path: '/login',
    query: { redirect: to.fullPath }
  })
  else if (requiresGuest && currentUser) next('/')
  else next()
})

export default router