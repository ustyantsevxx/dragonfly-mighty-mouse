export default [
  {
    path: '/',
    component: () => import('@/views/MainView'),
    meta: { title: 'Dragonfly Mighty Mouse' }
  },
  {
    path: '/account',
    component: () => import('@/views/AccountView'),
    meta: { requiresAuth: true, title: 'Мой профиль' }
  },
  {
    path: '*',
    component: () => import('@/views/ErrorView'),
    meta: { title: 'Ошибка 404' }
  }
]