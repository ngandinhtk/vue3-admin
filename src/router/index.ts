import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('../views/AdminSetting.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.currentUser) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.currentUser) {
    next('/dashboard')
  } else if (to.meta.requiresAdmin && authStore.currentUser?.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router