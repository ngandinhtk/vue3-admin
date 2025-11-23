import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/settings', // This route requires admin privileges
    name: 'AdminSettings',
    component: () => import('../views/AdminSetting.vue'),
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/', // Redirect root to dashboard
    redirect: { name: 'Dashboard' }
  },
  {
    path: '/:pathMatch(.*)*', // Catch-all for unknown routes
    redirect: { name: 'Dashboard' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const requiresAdmin = to.meta.requiresAdmin;

  if (requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login' }); // Redirect to login if auth required but not logged in
    return;
  }

  if (requiresAdmin && authStore.userRole !== 'Admin') {
    next({ name: 'Dashboard' }); // Redirect to dashboard if admin required but not admin
    return;
  }

  if (to.path === '/login' && authStore.isLoggedIn) {
    next({ name: 'Dashboard' }); // If logged in, prevent access to login page
    return;
  }

  next(); // Continue to the route
});

export default router;