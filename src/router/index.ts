import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// подключение страниц
import HomeView from '../views/HomeView.vue'
import InstructionsView from '../views/InstructionsView.vue'
import InstructionPreviewView from '../views/InstructionPreviewView.vue'
import InstructionPassingView from '../views/InstructionPlayerView.vue'

import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  //настройка путей
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
    },
    {
      path: '/instructions/:id',
      name: 'instruction-preview',
      component: InstructionPreviewView,
    },
    {
      path: '/instructions/:id/steps',
      name: 'instruction-player',
      component: InstructionPassingView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

// проверка авторизации перед переходом
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true
  }

  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.fetchCurrentUser()
  }

  if (!authStore.isAuthenticated) {
    return { name: 'login' }
  }

  return true
})

export default router
