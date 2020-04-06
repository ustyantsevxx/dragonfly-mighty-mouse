export default [
  {
    path: '/subjects',
    component: () => import('@/views/teacher/SubjectListView'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  },
  {
    path: '/subjects/:id',
    redirect: '/subjects/:id/tasks',
    component: () => import('@/views/teacher/SubjectView'),
    meta: { requiresAuth: true, dynamicTitle: true },
    children: [
      {
        path: 'tasks',
        component: () => import('@/components/teacher/TaskList'),
        meta: { requiresAuth: true },
      },
      {
        path: 'groups',
        component: () => import('@/components/teacher/GroupList'),
        meta: { requiresAuth: true, requiresTeacher: true },
      }
    ]
  }
]