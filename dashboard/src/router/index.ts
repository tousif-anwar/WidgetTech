import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Auth ──────────────────────────────────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { public: true },
    },

    // ── App shell (requires auth) ─────────────────────────────────────────
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },

        // Products
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/products/ProductListView.vue'),
        },
        {
          path: 'products/new',
          name: 'product-new',
          component: () => import('@/views/products/ProductFormView.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'product-edit',
          component: () => import('@/views/products/ProductFormView.vue'),
          props: true,
        },

        // Orders
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/orders/OrderListView.vue'),
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: () => import('@/views/orders/OrderDetailView.vue'),
          props: true,
        },

        // Analytics
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@/views/AnalyticsView.vue'),
        },

        // Stripe Connect
        {
          path: 'stripe-connect',
          name: 'stripe-connect',
          component: () => import('@/views/StripeConnectView.vue'),
        },

        // Settings
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
        },
      ],
    },

    // ── Catch-all ─────────────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Navigation guard — redirect to /login when unauthenticated
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Lazy-initialise user from existing token on first navigation
  if (!auth.user && auth.accessToken) {
    await auth.fetchMe()
  }

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.public && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
