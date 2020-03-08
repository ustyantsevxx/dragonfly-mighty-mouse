export default [
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
  }
]