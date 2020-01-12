export default [
  {
    path: '/subjects',
    component: () => import('@/views/teacher/Subjects'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  }
]