import { createRouter, createWebHistory } from 'vue-router'

import { isAuthenticated } from '@/services/auth'
import DashboardView from '@/views/DashboardView.vue'
import LinkFormView from '@/views/LinkFormView.vue'
import LinkStatsView from '@/views/LinkStatsView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/links/new',
      name: 'link-create',
      component: LinkFormView,
      meta: { requiresAuth: true },
    },
    {
      path: '/links/:id/edit',
      name: 'link-edit',
      component: LinkFormView,
      meta: { requiresAuth: true },
    },
    {
      path: '/links/:id/stats',
      name: 'link-stats',
      component: LinkStatsView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    return { name: 'dashboard' }
  }
})

export default router
