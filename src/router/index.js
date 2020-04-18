import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { auth } from '../main'
Vue.use(Router)

const routes = [
  {
    path: '/',
    component: () => import('@/views/MainView'),
    meta: { title: 'Dragonfly Mighty Mouse' }
  },
  {
    path: '*',
    component: () => import('@/views/ErrorView'),
    meta: { title: 'Ошибка 404' }
  },
  {
    path: '/login',
    component: () => import('@/views/auth/LoginView'),
    meta: { requiresGuest: true, title: 'Вход' }
  },
  {
    path: '/register',
    component: () => import('@/views/auth/RegisterView'),
    meta: { requiresGuest: true, title: 'Регистрация' }
  },
  {
    path: '/restore',
    component: () => import('@/views/auth/RestorePasswordView'),
    meta: { requiresGuest: true, title: 'Восстановление пароля' }
  },
  {
    path: '/account',
    component: () => import('@/views/AccountView'),
    meta: { requiresAuth: true, title: 'Мой профиль' }
  },
  {
    path: '/subjects',
    component: () => import('@/views/SubjectListView'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  },
  {
    path: '/subjects/:id',
    redirect: '/subjects/:id/tasks',
    component: () => import('@/views/SubjectView'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'tasks',
        component: () => import('@/components/domain/TaskList'),
        meta: { requiresAuth: true, dynamicTitle: true }
      },
      {
        path: 'groups',
        component: () => import('@/components/domain/GroupList'),
        meta: { requiresAuth: true, dynamicTitle: true }
      }
    ]
  },
  {
    path: '/join-group/:id',
    component: () => import('@/views/student/JoinGroup'),
    meta: {
      requiresAuth: true,
      requiresStudent: true,
      title: 'Приглашение в группу'
    }
  }
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
    store.commit('setToastMsg', {
      error: true,
      msg: 'Войдите для доступа к данной странице'
    })
    next({
      path: '/login',
      query: { next: to.fullPath }
    })
  } else if (requiresGuest && signed) next('/')
  else {
    if ((requiresTeacher && !isTeacher) || (requiresStudent && isTeacher)) {
      store.commit('setToastMsg', {
        error: true,
        msg: 'У вас нет доступа к данной странице!'
      })
      next('/')
    } else {
      next()
      if (!to.meta.dynamicTitle) document.title = to.meta.title
    }
  }
})

export default router
