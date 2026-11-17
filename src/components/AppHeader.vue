<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  await router.push('/')
}
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Логотип -->
      <RouterLink to="/" class="logo">
        <span class="logo-icon">G</span>

        <span class="logo-text"> Guide<span>List</span> </span>
      </RouterLink>

      <!-- Навигация -->
      <nav class="header-nav">
        <RouterLink to="/" class="nav-link"> Главная </RouterLink>

        <RouterLink to="/instructions" class="nav-link"> Инструкции </RouterLink>
      </nav>

      <div class="header-actions">
        <!-- Пока проверка -->
        <template v-if="!authStore.isInitialized">
          <div class="header-loader"></div>
        </template>

        <!-- Авторизованный пользователь -->
        <template v-else-if="authStore.isAuthenticated">
          <RouterLink to="/profile" class="profile-button">
            <span class="user-avatar">
              {{ authStore.user?.username.charAt(0).toUpperCase() }}
            </span>

            <span class="profile-text"> Мой профиль </span>
          </RouterLink>

          <button class="logout-button" type="button" @click="handleLogout">Выйти</button>
        </template>

        <!-- Неавторизованный пользователь -->
        <template v-else>
          <RouterLink to="/login" class="login-button"> Войти </RouterLink>

          <RouterLink to="/register" class="register-button"> Регистрация </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss" src="../assets/styles/header.scss"></style>
