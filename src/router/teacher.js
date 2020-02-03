export default [
  {
    path: '/subjects',
    component: () => import('@/views/teacher/Subjects'),
    meta: { requiresAuth: true, title: 'Мои дисциплины' }
  },
  {
    path: '/subjects/:id',
    component: () => import('@/views/teacher/Subject'),
    meta: { requiresAuth: true, dynamicTitle: true },
    children: [
      {
        path: 'tasklist',
        component: () => import('@/components/teacher/TaskList'),
        meta: { requiresAuth: true },
      }
    ]
  },
  {
    path: '/groups',
    component: () => import('@/views/teacher/GroupsView'),
    meta: { requiresAuth: true, title: 'Учебные группы' }
  },
]