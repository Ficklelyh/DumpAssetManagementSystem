import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('@/views/Home.vue') },
      { path: 'user-asset', name: 'UserAsset', component: () => import('@/views/UserAsset.vue') },
      { path: 'school-asset', name: 'SchoolAsset', component: () => import('@/views/SchoolAsset.vue') },
      { path: 'dept-asset', name: 'DeptAsset', component: () => import('@/views/DeptAsset.vue') },
      { path: 'department-manage', name: 'DeptManage', component: () => import('@/views/DepartmentManage.vue') },
      { path: 'user-add', name: 'UserAdd', component: () => import('@/views/UserAdd.vue') },
      { path: 'change-pwd', name: 'ChangePwd', component: () => import('@/views/ChangePwd.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const level = sessionStorage.getItem('level')
  if (to.path !== '/login' && !level) {
    next('/login')
  } else {
    next()
  }
})

export default router
