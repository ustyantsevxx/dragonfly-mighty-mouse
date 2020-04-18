export default [
  {
    path: '/subjects',
    component: () => import('@/views/shared/SubjectListView'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  },
  {
    path: '/subjects/:id',
    redirect: '/subjects/:id/tasks',
    component: () => import('@/views/shared/SubjectView'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'tasks',
        component: () => import('@/components/shared/TaskList'),
        meta: { requiresAuth: true, dynamicTitle: true }
      },
      {
        path: 'groups',
        component: () => import('@/components/shared/GroupList'),
        meta: { requiresAuth: true, dynamicTitle: true }
      }
    ]
  }
]