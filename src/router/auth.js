export default [
  {
    path: '/login',
    component: () => import('@/views/auth/Login'),
    meta: { requiresGuest: true, title: 'Вход' }
  },
  {
    path: '/register',
    component: () => import('@/views/auth/Register'),
    meta: { requiresGuest: true, title: 'Регистрация' }
  },
  {
    path: '/restore',
    component: () => import('@/views/auth/RestorePassword'),
    meta: { requiresGuest: true, title: 'Восстановление пароля' }
  }
]