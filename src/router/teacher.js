export default [
  {
    path: '/subjects',
    component: () => import('@/views/teacher/SubjectListView'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  },
  {
    path: '/subjects/:id',
    component: () => import('@/views/teacher/SubjectView'),
    meta: { requiresAuth: true, dynamicTitle: true }
  }
]