import { createRouter, createWebHistory } from 'vue-router'

import { isAuthenticated } from '@/services/auth'
import DashboardView from '@/views/DashboardView.vue'
import LinkFormView from '@/views/LinkFormView.vue'
import LinkStatsView from '@/views/LinkStatsView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const GUEST_ROUTES = new Set(['login', 'register'])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/links/new',
      name: 'link-create',
      component: LinkFormView,
    },
    {
      path: '/links/:id/edit',
      name: 'link-edit',
      component: LinkFormView,
    },
    {
      path: '/links/:id/stats',
      name: 'link-stats',
      component: LinkStatsView,
    },
  ],
})

router.beforeEach((to) => {
  const isGuestRoute = GUEST_ROUTES.has(to.name)

  if (!isGuestRoute && !isAuthenticated()) {
    return '/login'
  }

  if (isGuestRoute && isAuthenticated()) {
    return '/'
  }
})

export default router
