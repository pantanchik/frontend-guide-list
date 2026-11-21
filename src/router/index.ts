import { createRouter, createWebHistory } from 'vue-router'

// подключение страниц
import HomeView from '../views/HomeView.vue'
import InstructionsView from '../views/InstructionsView.vue'
import InstructionPreviewView from '../views/InstructionPreviewView.vue'

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
    },
  ],
})

export default router
