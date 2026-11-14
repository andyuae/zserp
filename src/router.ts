import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { supabaseConfigured } from './lib/supabase'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: () => import('./views/LoginView.vue'), meta: { title: '登录' } },
    { path: '/preview', component: () => import('./views/DashboardView.vue'), meta: { title: '周表现预览' } },
    { path: '/workspace', component: () => import('./views/DashboardView.vue'), meta: { requiresAuth: true, title: '周表现' } },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach(async (to) => {
  document.title = `${String(to.meta.title ?? '运营数据工作台')} · 运营数据工作台`
  const auth = useAuthStore()
  await auth.initialize()
  if (to.meta.requiresAuth && supabaseConfigured && !auth.user) return '/login'
  if (to.meta.requiresAuth && !supabaseConfigured) return '/login'
  return true
})

export default router
