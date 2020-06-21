import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import store from '@/store'
import { AUTH } from '@/main'
Vue.use(Router)

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/views/index.vue'),
    meta: { title: 'Dragonfly.vue' }
  },
  // {
  //   path: '*',
  //   component: () => import('@/views/not-found/index.vue'),
  //   meta: { title: 'Ошибка 404' }
  // },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index.vue'),
  //   meta: { requiresGuest: true, title: 'Вход' }
  // },
  // {
  //   path: '/register',
  //   component: () => import('@/views/register/index.vue'),
  //   meta: { requiresGuest: true, title: 'Регистрация' }
  // },
  // {
  //   path: '/restore',
  //   component: () => import('@/views/restore/index.vue'),
  //   meta: { requiresGuest: true, title: 'Восстановление пароля' }
  // },
  // {
  //   path: '/account',
  //   component: () => import('@/views/account/index.vue'),
  //   meta: { requiresAuth: true, title: 'Мой профиль' }
  // },
  {
    path: '/subjects',
    component: () => import('@/views/subjects/index.vue'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  }
  // {
  //   path: '/subjects/:id',
  //   redirect: '/subjects/:id/tasks',
  //   component: () => import('@/views/subject/index.vue'),
  //   meta: { requiresAuth: true },
  //   children: [
  //     {
  //       path: 'tasks',
  //       component: () => import('@/views/subject/components/TaskList.vue'),
  //       meta: { requiresAuth: true, dynamicTitle: true }
  //     },
  //     {
  //       path: 'groups',
  //       component: () =>
  //         import('@/views/subject/components/GroupList/index.vue'),
  //       meta: { requiresAuth: true, requiresTeacher: true, dynamicTitle: true }
  //     },
  //     {
  //       path: 'stats',
  //       component: () =>
  //         import('@/views/subject/components/GroupList/index.vue'),
  //       meta: { requiresAuth: true, requiresStudent: true, dynamicTitle: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/groups/join/:id',
  //   component: () => import('@/views/join-group/index.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     requiresStudent: true,
  //     title: 'Приглашение в группу'
  //   }
  // }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 })
})

router.beforeEach((to, _from, next) => {
  const signed = !!AUTH.currentUser
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
