import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import InstructionsView from '../views/InstructionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/instructions',
      name: 'instructions',
      component: InstructionsView,
    }
  ],
})

export default router
