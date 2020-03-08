export default [
  {
    path: '/join-group/:id',
    component: () => import('@/views/student/JoinGroup'),
    meta: { requiresAuth: true, requiresStudent: false, title: 'Приглашение в группу' }
  }
]