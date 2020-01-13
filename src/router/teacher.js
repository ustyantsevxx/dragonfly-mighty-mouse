export default [
  {
    path: '/subjects',
    component: () => import('@/views/teacher/Subjects'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  },
  {
    path: '/subjects/:id',
    component: () => import('@/views/teacher/Subject'),
    meta: { requiresAuth: true, title: 'Просмотр дисциплины' },
  }
]