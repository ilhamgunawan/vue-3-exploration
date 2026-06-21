import { createRouter, createWebHistory } from 'vue-router'

import ProductListView from '@/views/ProductListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      component: ProductListView,
    },
  ],
})

export default router
